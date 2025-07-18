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

function normalizePriceUnits(price) {
  return Number(formatUnits(price, 8)); // Assuming 8 decimals for price feeds
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

function getReadableContract(id) {
  return getPriceMonitorContract(CONTRACT_ADDRESSES[id], getJsonProvider());
}

async function readPriceFromFeed(feedAddress) {
  const feed = getFeedContract(feedAddress, getJsonProvider());
  const { answer } = await feed.latestRoundData();

  return normalizePriceUnits(answer);
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
      threshold: normalizePriceUnits(threshold),
      lastPrice: normalizePriceUnits(price),
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
    lastPrice: normalizePriceUnits(newPrice),
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
