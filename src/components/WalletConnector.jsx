/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState } from "react";

import { getWritableContract } from "@/utils/contractUtils";
import { useToken } from "@/context/TokenContext";

export default function WalletConnector() {
  const { selectedToken } = useToken();
  const [address, setAddress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkConnection() {
      if (!window.ethereum) return;
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        }
      } catch (err) {
        console.error("Error checking wallet connection:", err);
      }
    }
    checkConnection();
  }, []);

  const connect = async () => {
    try {
      await getWritableContract(selectedToken.id, setError);
      const [account] = await window.ethereum.request({
        method: "eth_accounts",
      });
      setAddress(account);
      setError("");
    } catch (err) {
      console.error("Wallet connect error:", err);
      if (!error) setError("Connection failed or was rejected.");
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
