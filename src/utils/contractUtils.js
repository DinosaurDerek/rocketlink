import { ethers } from "ethers";

import { CONTRACT_ADDRESSES, CONTRACT_ABI } from "@/constants";

export async function getWritableContract(id) {
  if (!window.ethereum) throw new Error("MetaMask not available");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESSES[id], CONTRACT_ABI, signer);
}

export function getReadableContract(id) {
  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_FUJI_RPC_URL
  );

  return new ethers.Contract(CONTRACT_ADDRESSES[id], CONTRACT_ABI, provider);
}

export async function readLastPrice(id) {
  const contract = getReadableContract(id);
  const lastPrice = await contract.lastPrice();
  return convertToReadablePrice(lastPrice);
}

export function convertToReadablePrice(price) {
  return Number(price) / 1e8;
}
