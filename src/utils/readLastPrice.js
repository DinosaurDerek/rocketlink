import { getReadableContract } from "./getContract";

export async function readLastPrice() {
  const contract = getReadableContract();

  const lastPrice = await contract.lastPrice();
  return Number(lastPrice) / 1e8;
}
