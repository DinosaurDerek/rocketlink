/** @jsxImportSource @emotion/react */
"use client";

import Image from "next/image";
import { formatHeadingPrice } from "@/utils/format";
import { useToken } from "@/context/TokenContext";
import ThresholdBanner from "@/components/ThresholdBanner";
import TokenChart from "@/components/TokenChart";
import Loader from "@/components/Loader";

export default function AppContent() {
  const { selectedToken } = useToken();

  if (!selectedToken) {
    return <p>Select a token to view details</p>;
  }

  return (
    <div css={styles.container}>
      <h2 css={styles.heading} data-testid="token-heading">
        {selectedToken.logo && (
          <Image
            src={selectedToken.logo}
            alt={selectedToken.symbol.toUpperCase()}
            css={styles.logo}
            width={24}
            height={24}
          />
        )}
        {selectedToken.label} ({selectedToken.symbol.toUpperCase()})
      </h2>
      <div>
        Current price:{" "}
        {selectedToken?.price ? (
          formatHeadingPrice(selectedToken.price)
        ) : (
          <Loader />
        )}
      </div>
      <TokenChart tokenId={selectedToken.id} />
      <ThresholdBanner />
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
};
