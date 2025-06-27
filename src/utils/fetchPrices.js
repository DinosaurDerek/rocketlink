import { ethers } from "ethers";

import { TOKENS } from "@/constants";
import { convertToReadablePrice } from "./contractUtils";

const aggregatorV3InterfaceABI = [
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

export async function fetchPriceFromChainlink(feedAddress) {
  const { Contract, JsonRpcProvider } = ethers;

  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_FUJI_RPC_URL);
  const priceFeed = new Contract(
    feedAddress,
    aggregatorV3InterfaceABI,
    provider
  );
  const roundData = await priceFeed.latestRoundData();

  return convertToReadablePrice(roundData.answer);
}

export async function fetchAllPrices() {
  const tokensWithPrices = await Promise.all(
    TOKENS.map(async (token) => {
      const price = await fetchPriceFromChainlink(token.feedAddress);
      return { ...token, price };
    })
  );

  return tokensWithPrices;
}
