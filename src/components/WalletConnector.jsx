/** @jsxImportSource @emotion/react */
"use client";

import { useState } from "react";

import { useEffect } from "react";

const FUJI_CHAIN_ID = "0xa869"; // 43113 in hex

async function switchToFuji(setError) {
  if (!window.ethereum) {
    const msg = "MetaMask not installed";
    setError(msg);
    throw new Error(msg);
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: FUJI_CHAIN_ID }],
    });
  } catch (err) {
    if (err.code === 4902) {
      // Chain not found, try to add it
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
        // Try switching again after adding
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: FUJI_CHAIN_ID }],
        });
      } catch (addErr) {
        setError("Failed to add Fuji network");
        throw addErr;
      }
    } else {
      setError("Failed to switch network");
      throw err;
    }
  }
}

export default function WalletConnector() {
  const [address, setAddress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if already connected
    async function checkConnection() {
      if (!window.ethereum) return;
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      }
    }
    checkConnection();
  }, []);

  const connect = async () => {
    try {
      await switchToFuji(setError);

      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAddress(account);
      setError("");
    } catch (err) {
      console.error("Wallet connect error:", err);
      if (!error) setError("Connection failed or was rejected");
    }
  };

  return (
    <div>
      {address ? (
        <span css={styles.connected}>
          Connected: {address.slice(0, 6)}…{address.slice(-4)}
        </span>
      ) : (
        <button css={styles.button} onClick={connect}>
          Connect Wallet
        </button>
      )}
      {error && <div css={styles.error}>{error}</div>}
    </div>
  );
}

const styles = {
  button: (theme) => ({
    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
    backgroundColor: theme.colors.primary,
    color: "#fff",
    border: "none",
    borderRadius: theme.borderRadius,
    cursor: "pointer",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: theme.colors.primaryHover,
    },
  }),
  connected: (theme) => ({
    fontWeight: 500,
    color: theme.colors.text,
  }),
  error: (theme) => ({
    marginTop: theme.spacing(0.5),
    color: theme.colors.error,
    fontSize: theme.fontSizes.small,
  }),
};
