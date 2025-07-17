import { FUJI_CHAIN_ID } from "@/constants";

export async function ensureCorrectNetwork(setError) {
  const currentChainId = await window.ethereum.request({
    method: "eth_chainId",
  });
  if (currentChainId === FUJI_CHAIN_ID) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: FUJI_CHAIN_ID }],
    });
  } catch (err) {
    if (err.code === 4902) {
      // Add network if not found
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
    } else {
      if (setError) setError("Please switch to Avalanche Fuji Testnet");
      throw err;
    }
  }
}
