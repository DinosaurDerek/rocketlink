/** @jsxImportSource @emotion/react */
"use client";

import WalletConnector from "@/components/WalletConnector";

export default function AppHeader() {
  return (
    <header css={styles.container}>
      <h1>🚀 Rocketlink</h1>
      <WalletConnector />
    </header>
  );
}

const styles = {
  container: (theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.backgroundSecondary,
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
    borderBottom: theme.border,
    flexWrap: "wrap",
    gap: theme.spacing(1),
  }),
};
