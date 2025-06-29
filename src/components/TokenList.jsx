/** @jsxImportSource @emotion/react */
"use client";

import { useToken } from "@/context/TokenContext";
import TokenCard from "@/components/TokenCard";
import Message from "@/components/Message";
import Loader from "@/components/Loader";

export default function TokenList() {
  const { tokens, selectedToken, selectToken, error } = useToken();

  if (error) return <Message text={error.message} />;
  if (!tokens.length) return <Loader />;

  return (
    <div css={styles.container}>
      <h2 css={styles.heading}>Top Tokens</h2>
      <div css={styles.list}>
        {tokens.map((token) => (
          <TokenCard
            key={token.id}
            token={token}
            onClick={() => selectToken(token)}
            isSelected={selectedToken?.id === token.id}
          />
        ))}
      </div>
    </div>
  );
}

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
  }),
};
