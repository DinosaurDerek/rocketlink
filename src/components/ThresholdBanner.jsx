/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useToken } from "@/context/TokenContext";
import {
  getReadableContract,
  getWritableContract,
  convertToReadablePrice,
} from "@/utils/contractUtils";

export default function ThresholdBanner() {
  const { selectedToken } = useToken();
  const [breached, setBreached] = useState(null);
  const [lastPrice, setLastPrice] = useState(null);
  const [error, setError] = useState("");
  const [thresholdInput, setThresholdInput] = useState(0);

  useEffect(() => {
    if (!selectedToken?.id) return;

    let intervalId;

    async function loadData() {
      try {
        const contract = getReadableContract(selectedToken.id);
        const [status, threshold, price] = await Promise.all([
          contract.isThresholdBreached(),
          contract.threshold(),
          contract.lastPrice(),
        ]);

        setBreached(status);
        setLastPrice(convertToReadablePrice(price));
        setThresholdInput(convertToReadablePrice(threshold));
        setError("");
      } catch (err) {
        console.error("Error reading contract data:", err);
        setError("Failed to load contract status.");
      }
    }

    loadData();
    intervalId = setInterval(loadData, 15000);

    return () => clearInterval(intervalId);
  }, [selectedToken?.id]);

  const handleUpdatePrice = async () => {
    try {
      const contract = await getWritableContract(selectedToken.id, setError);
      const tx = await contract.updatePrice();
      await tx.wait();

      const [newPrice, newStatus] = await Promise.all([
        contract.lastPrice(),
        contract.isThresholdBreached(),
      ]);

      setLastPrice(convertToReadablePrice(newPrice));
      setBreached(newStatus);
      setError("");
    } catch (err) {
      console.error("Failed to update price:", err);
      setError("Transaction failed or was rejected.");
    }
  };

  const handleSetThreshold = async () => {
    try {
      const contract = await getWritableContract(selectedToken.id, setError);
      const tx = await contract.setThreshold(
        ethers.parseUnits(thresholdInput.toString(), 8)
      );
      await tx.wait();

      const newStatus = await contract.isThresholdBreached();
      setBreached(newStatus);
      setError("");
    } catch (err) {
      console.error("Failed to set alert:", err);
      setError("Transaction failed or was rejected.");
    }
  };

  if (error) return <div css={styles.bannerError}>{error}</div>;
  if (breached === null) return null;

  return (
    <div css={breached ? styles.bannerBreached : styles.bannerSafe}>
      <label>
        Alert me if price drops below: $
        <input
          type="number"
          value={thresholdInput}
          onChange={(event) => setThresholdInput(event.target.value)}
        />
        <button onClick={handleSetThreshold} css={styles.button}>
          Set Alert
        </button>
      </label>
      <div>
        {breached
          ? "⚠️ Price threshold breached!"
          : "✅ All token prices are within safe range."}
      </div>
      {lastPrice !== null && (
        <div>Last on-chain price: ${Number(lastPrice).toFixed(2)}</div>
      )}
      <button onClick={handleUpdatePrice} css={styles.button}>
        Update Price
      </button>
    </div>
  );
}

const styles = {
  bannerBreached: (theme) => ({
    backgroundColor: "#ffe5e5",
    color: "#a00",
    padding: theme.spacing(1),
    borderRadius: theme.borderRadius,
    fontWeight: 600,
  }),
  bannerSafe: (theme) => ({
    backgroundColor: "#e6ffe6",
    color: "#065f46",
    padding: theme.spacing(1),
    borderRadius: theme.borderRadius,
    fontWeight: 600,
  }),
  bannerError: (theme) => ({
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: theme.spacing(1),
    borderRadius: theme.borderRadius,
    fontWeight: 600,
  }),
  button: (theme) => ({
    marginTop: theme.spacing(1),
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
};
