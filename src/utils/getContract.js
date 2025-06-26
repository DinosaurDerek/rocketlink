import { ethers } from "ethers";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";

export async function getWritableContract() {
  if (!window.ethereum) throw new Error("MetaMask not available");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

export function getReadableContract() {
  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_FUJI_RPC_URL
  );

  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}
