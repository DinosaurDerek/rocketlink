import {
  BrowserProvider,
  Contract,
  formatUnits,
  JsonRpcProvider,
  parseUnits,
} from "ethers";

import { CONTRACT_ADDRESSES } from "@/constants";
import { ensureCorrectNetwork } from "@/utils/network";
import { PriceMonitorAbi } from "@/abi/PriceMonitor.js";

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

// helper: convert a BigNumber price -> number (for display)
// assume 8 decimals for Chainlink price feeds
function bigNumberToNumber(bigNumber) {
  // formatUnits returns a string; parseFloat yields JS number for display
  return parseFloat(formatUnits(bigNumber, 8));
}

function getPriceMonitorContract(address, signerOrProvider) {
  return new Contract(address, PriceMonitorAbi, signerOrProvider);
}

function getFeedContract(address, signerOrProvider) {
  return new Contract(address, CHAINLINK_FEED_ABI, signerOrProvider);
}

function getJsonProvider() {
  return new JsonRpcProvider(process.env.NEXT_PUBLIC_FUJI_RPC_URL);
}

export function getReadableContract(id) {
  return getPriceMonitorContract(CONTRACT_ADDRESSES[id], getJsonProvider());
}

export async function readPriceFromFeed(feedAddress) {
  const feed = getFeedContract(feedAddress, getJsonProvider());
  const { answer } = await feed.latestRoundData();

  return bigNumberToNumber(answer);
}

export async function getWritableContract(id, setError) {
  if (!window.ethereum) throw new Error("MetaMask not available");

  await ensureCorrectNetwork(setError);

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return getPriceMonitorContract(CONTRACT_ADDRESSES[id], signer);
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

export async function fetchPriceMonitorData(tokenId, setState, setError) {
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
      threshold: bigNumberToNumber(threshold),
      lastPrice: bigNumberToNumber(price),
      lastUpdatedAt: Number(updatedAt) * 1000, // ms for JS Date
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
    lastPrice: bigNumberToNumber(newPrice),
    breached: newStatus,
  };
}

export async function setThresholdAndGetStatus(tokenId, threshold) {
  const contract = await getWritableContract(tokenId);
  const tx = await contract.setThreshold(parseUnits(threshold.toString(), 8));
  await tx.wait();

  const newStatus = await contract.isThresholdBreached();
  return { breached: newStatus };
}
