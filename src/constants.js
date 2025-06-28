import { PriceMonitorAbi } from "./abi/PriceMonitor.js";
import { deployedContracts } from "./deployed-contracts.js";
import TOKENS_JSON from "./tokens.json";

export const CONTRACT_ABI = PriceMonitorAbi;
export const CONTRACT_ADDRESSES = deployedContracts;
export const TOKENS = TOKENS_JSON;
export const FUJI_RPC_URL = process.env.NEXT_PUBLIC_FUJI_RPC_URL;
export const FUJI_CHAIN_ID = "0xa869"; // 43113 in hex
