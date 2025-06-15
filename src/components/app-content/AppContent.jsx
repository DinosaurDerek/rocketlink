/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { fetchPriceHistory } from "@/utils/fetchPriceHistory";
import { formatHeadingPrice } from "@/utils/format";
import { useToken } from "@/context/TokenContext";
import TokenChart from "@/components/TokenChart";
import Message from "@/components/Message";
import Loader from "@/components/Loader";

export default function AppContent() {
  const { selectedToken } = useToken();
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedToken) return;

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        setError(null);
        const response = await fetchPriceHistory(selectedToken.id, setError);
        setPriceHistory(response);
      } catch (err) {
        console.error("Failed to fetch price history:", err);
        setError(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [selectedToken]);

  if (!selectedToken) {
    return <p>Select a token to view details</p>;
  }

  return (
    <div css={styles.container}>
      <h2 css={styles.heading} data-testid="token-heading">
        {selectedToken.image && (
          <Image
            src={selectedToken.image}
            alt={selectedToken.symbol.toUpperCase()}
            css={styles.logo}
            width={24}
            height={24}
          />
        )}
        {selectedToken.name} ({selectedToken.symbol.toUpperCase()})
      </h2>
      <p>Current price: {formatHeadingPrice(selectedToken.current_price)}</p>
      {error && <Message text={error.message} />}
      <div css={styles.chartWrapper}>
        {(error || loading) && (
          <div css={styles.loaderOverlay}>
            <Loader />
          </div>
        )}
        {!error && !!priceHistory?.length && <TokenChart data={priceHistory} />}
      </div>
    </div>
  );
}

const styles = {
  container: (theme) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2.5),
  }),
  heading: {
    display: "flex",
    alignItems: "center",
  },
  logo: (theme) => ({
    marginRight: theme.spacing(1),
    borderRadius: "50%",
  }),
  chartWrapper: {
    position: "relative",
    minHeight: 300,
  },
  loaderOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "transparent",
  },
};
