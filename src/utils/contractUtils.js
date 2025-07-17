import { ethers } from "ethers";

import { CONTRACT_ADDRESSES, CONTRACT_ABI } from "@/constants";
import { ensureCorrectNetwork } from "@/utils/network";

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

  await ensureCorrectNetwork(setError);

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

export async function fetchTokenFeedPrices(
  tokens,
  setTokens,
  setError,
  selectedId,
  setSelectedId
) {
  try {
    const updated = await Promise.all(
      tokens.map(async (token) => {
        try {
          const price = await readPriceFromFeed(token.feedAddress);
          return { ...token, price };
        } catch {
          return token;
        }
      })
    );

    setTokens(updated);
    setError(null);
    if (selectedId === null && updated.length) {
      setSelectedId(updated[0].id);
    }
  } catch (err) {
    console.error("Failed to load feed prices:", err);
    setError(err);
  }
}

export async function fetchThresholdContractData(tokenId, setState, setError) {
  try {
    const contract = getReadableContract(tokenId);
    const [status, threshold, price, updatedAt] = await Promise.all([
      contract.isThresholdBreached(),
      contract.threshold(),
      contract.lastPrice(),
      contract.lastUpdatedAt(),
    ]);

    setState({
      breached: status,
      threshold: convertToReadablePrice(threshold),
      lastPrice: convertToReadablePrice(price),
      lastUpdatedAt: Number(updatedAt) * 1000,
    });
    setError("");
  } catch (err) {
    console.error("Error reading contract data:", err);
    setError("⚠️ Failed to load contract data.");
  }
}

export async function updatePriceAndStatus(tokenId) {
  const contract = await getWritableContract(tokenId);
  const tx = await contract.updatePrice();
  await tx.wait();

  const [newPrice, newStatus] = await Promise.all([
    contract.lastPrice(),
    contract.isThresholdBreached(),
  ]);

  return {
    lastPrice: convertToReadablePrice(newPrice),
    breached: newStatus,
  };
}

export async function setThresholdAndGetStatus(tokenId, threshold) {
  const contract = await getWritableContract(tokenId);
  const tx = await contract.setThreshold(
    ethers.parseUnits(threshold.toString(), 8)
  );
  await tx.wait();

  const newStatus = await contract.isThresholdBreached();
  return { breached: newStatus };
}
