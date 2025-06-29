import { ethers } from "ethers";

import { CONTRACT_ADDRESSES, CONTRACT_ABI, FUJI_CHAIN_ID } from "@/constants";

const CHAINLINK_FEED_ABI = [
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

function getJsonProvider() {
  return new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_FUJI_RPC_URL);
}

export async function getWritableContract(id, setError) {
  if (!window.ethereum) throw new Error("MetaMask not available");

  const currentChainId = await window.ethereum.request({
    method: "eth_chainId",
  });

  if (currentChainId !== FUJI_CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: FUJI_CHAIN_ID }],
      });
    } catch (err) {
      if (err.code === 4902) {
        // Network not added to MetaMask yet
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: FUJI_CHAIN_ID,
                chainName: "Avalanche Fuji Testnet",
                rpcUrls: [process.env.NEXT_PUBLIC_FUJI_RPC_URL],
                nativeCurrency: {
                  name: "Avalanche",
                  symbol: "AVAX",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://testnet.snowtrace.io/"],
              },
            ],
          });
        } catch (addErr) {
          if (setError) setError("Failed to add Fuji network");
          throw addErr;
        }
      } else {
        if (setError) setError("Please switch to Avalanche Fuji Testnet");
        throw err;
      }
    }
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESSES[id], CONTRACT_ABI, signer);
}

export function getReadableContract(id) {
  return new ethers.Contract(
    CONTRACT_ADDRESSES[id],
    CONTRACT_ABI,
    getJsonProvider()
  );
}

export async function readLastPrice(id) {
  const contract = getReadableContract(id);
  const lastPrice = await contract.lastPrice();
  return convertToReadablePrice(lastPrice);
}

export async function readPriceFromFeed(feedAddress) {
  const feed = new ethers.Contract(
    feedAddress,
    CHAINLINK_FEED_ABI,
    getJsonProvider()
  );
  const { answer } = await feed.latestRoundData();

  return convertToReadablePrice(answer);
}

export function convertToReadablePrice(price) {
  return Number(price) / 1e8;
}
