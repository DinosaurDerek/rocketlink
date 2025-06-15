/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";

import { fetchTokens } from "@/utils/fetchTokens";
import { useToken } from "@/context/TokenContext";
import TokenCard from "@/components/token-card/TokenCard";
import Message from "@/components/Message";
import Loader from "@/components/Loader";

export default function TokenList() {
  const { selectedToken, setSelectedToken } = useToken();
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const response = await fetchTokens(setError);
        setTokens(response);
        setError(null);

        if (response.length) {
          setSelectedToken(response[0]);
        }
      } catch (err) {
        console.error("Failed to fetch top tokens:", err);
        setError(err);
      }
    };

    loadTokens();
  }, [setError, setSelectedToken, setTokens]);

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
        {tokens.map((token) => (
          <TokenCard
            key={token.id}
            token={token}
            onClick={() => setSelectedToken(token)}
            isSelected={selectedToken?.id === token.id}
          />
        ))}
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
