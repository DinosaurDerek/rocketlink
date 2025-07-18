/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState } from "react";

import {
  fetchPriceMonitorData,
  setThresholdAndGetStatus,
  updatePriceAndStatus,
} from "@/utils/contractUtils";
import Loader from "./Loader";
import Button from "@/components/Button";
import { useToken } from "@/context/TokenContext";
import { formatDateTime, formatPrice } from "@/utils/format";

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

    const loadAndSet = () => {
      fetchPriceMonitorData(
        selectedToken.id,
        (data) => {
          setBreached(data.breached);
          setThresholdInput(data.threshold);
          setLastPrice(data.lastPrice);
          setLastUpdatedAt(data.lastUpdatedAt);
        },
        setError
      );
    };

    if (document.visibilityState === "visible") {
      loadAndSet();
      intervalId = setInterval(loadAndSet, 30000);
    }

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadAndSet();
        intervalId = setInterval(loadAndSet, 30000);
      } else {
        clearInterval(intervalId);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [selectedToken?.id]);

  const handleUpdatePrice = async () => {
    setLoading(true);

    try {
      const { lastPrice, breached } = await updatePriceAndStatus(
        selectedToken.id
      );

      setLastPrice(lastPrice);
      setBreached(breached);
      setError("");
    } catch (err) {
      console.error("Failed to update price:", err);
      setError("Transaction failed or was rejected.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetThreshold = async () => {
    if (thresholdInput === "") {
      setError("Threshold cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const { breached } = await setThresholdAndGetStatus(
        selectedToken.id,
        thresholdInput
      );

      setBreached(breached);
      setError("");
    } catch (err) {
      console.error("Failed to set threshold:", err);
      setError("Transaction failed or was rejected.");
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
