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
import Loader from "./Loader";
import { formatDateTime, formatPrice } from "@/utils/format";
import Button from "@/components/Button";

export default function ThresholdBanner() {
  const { selectedToken } = useToken();
  const [breached, setBreached] = useState(null);
  const [lastPrice, setLastPrice] = useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [thresholdInput, setThresholdInput] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedToken?.id) return;

    let intervalId;

    const loadData = async () => {
      try {
        const contract = getReadableContract(selectedToken.id);
        const [status, threshold, price, updatedAt] = await Promise.all([
          contract.isThresholdBreached(),
          contract.threshold(),
          contract.lastPrice(),
          contract.lastUpdatedAt(),
        ]);

        setBreached(status);
        setLastPrice(convertToReadablePrice(price));
        setLastUpdatedAt(Number(updatedAt) * 1000);
        setThresholdInput(convertToReadablePrice(threshold));
        setError("");
      } catch (err) {
        console.error("Error reading contract data:", err);
        setError("⚠️ Failed to load contract data.");
      }
    };

    const startPolling = () => {
      loadData();
      intervalId = setInterval(loadData, 30000);
    };

    const stopPolling = () => clearInterval(intervalId);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startPolling();
      } else {
        stopPolling();
      }
    };

    // Start polling when component mounts or when token changes
    if (document.visibilityState === "visible") {
      startPolling();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedToken?.id]);

  const handleUpdatePrice = async () => {
    setLoading(true);
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
      setError("⚠️ Transaction failed or was rejected.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetThreshold = async () => {
    if (thresholdInput === "") {
      setError("⚠️ Threshold cannot be empty.");
      return;
    }

    setLoading(true);
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
      console.error("Failed to set threshold:", err);
      setError("⚠️ Transaction failed or was rejected.");
    } finally {
      setLoading(false);
    }
  };

  if (breached === null && !error) return null;

  return (
    <div css={styles.container}>
      {error && <div css={styles.error}>{error}</div>}

      {!error && (
        <div css={breached ? styles.alertBreached : styles.alertSafe}>
          {breached
            ? "☠️ Price threshold breached!"
            : "🟢 Token price is within safe range."}
        </div>
      )}

      <div css={styles.formRow}>
        <label htmlFor="threshold">Alert below:</label>
        <input
          id="threshold"
          type="number"
          value={thresholdInput}
          onChange={(event) => setThresholdInput(event.target.value)}
        />
        <Button onClick={handleSetThreshold} disabled={loading}>
          Set Alert
        </Button>
      </div>

      <div css={styles.priceRow}>
        <span>
          Last on-chain price:{" "}
          {lastPrice != null ? formatPrice(lastPrice) : <Loader />}
        </span>
        <Button onClick={handleUpdatePrice} disabled={loading}>
          Update Price
        </Button>
      </div>
      <div>
        <span>Last updated on-chain: </span>
        <span>{formatDateTime(lastUpdatedAt)}</span>
      </div>
    </div>
  );
}

const styles = {
  container: (theme) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.cardLight,
    color: theme.colors.text,
    fontSize: theme.fontSizes.small,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  }),
  alertBreached: {
    backgroundColor: "#ffe5e5",
    color: "#a00",
    padding: "8px",
    borderRadius: "8px",
    fontWeight: 600,
  },
  alertSafe: {
    backgroundColor: "#e6ffe6",
    color: "#065f46",
    padding: "8px",
    borderRadius: "8px",
    fontWeight: 600,
  },
  error: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "8px",
    borderRadius: "8px",
    fontWeight: 600,
  },
  formRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
};
