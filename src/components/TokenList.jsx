/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";

import { readLastPrice, readPriceFromFeed } from "@/utils/contractUtils";
import { useToken } from "@/context/TokenContext";
import TokenCard from "@/components/TokenCard";
import Message from "@/components/Message";
import Loader from "@/components/Loader";
import { TOKENS } from "@/constants";

export default function TokenList() {
  const { selectedToken, setSelectedToken } = useToken();
  const [tokens, setTokens] = useState(TOKENS);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokenPrices = async () => {
      try {
        const updatedTokens = await Promise.all(
          TOKENS.map(async (token) => {
            try {
              const lastPrice = await readLastPrice(token.id);
              if (lastPrice && lastPrice > 0) {
                return { ...token, price: lastPrice };
              } else {
                const fallbackPrice = await readPriceFromFeed(
                  token.feedAddress
                );
                return { ...token, price: fallbackPrice };
              }
            } catch (err) {
              console.error(`Error loading price for ${token.label}`, err);
              return token;
            }
          })
        );
        setTokens(updatedTokens);
        setSelectedToken((prev) => prev || updatedTokens[0]);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch token prices:", err);
        setError(err);
      }
    };

    fetchTokenPrices();
    const interval = setInterval(fetchTokenPrices, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (token) => {
    setSelectedToken(token);
  };

  return (
    <div css={styles.container}>
      <h2 css={styles.heading}>Top Tokens</h2>
      {error && (
        <div>
          <Message text={error.message} />
          <Loader />
        </div>
      )}
      <div css={styles.list}>
        {tokens.map((token) => {
          return (
            <TokenCard
              key={token.id}
              token={token}
              onClick={() => handleClick(token)}
              isSelected={selectedToken?.id === token.id}
            />
          );
        })}
      </div>
    </div>
  );
}

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const styles = {
  container: (theme) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  }),
  heading: (theme) => ({
    fontSize: theme.fontSizes.large,
    marginBottom: theme.spacing(1),
  }),
  list: (theme) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.75),
    opacity: 0,
    transform: "translateY(4px)",
    animation: `${fadeInUp} 800ms ease-out forwards`,
  }),
};
