/** @jsxImportSource @emotion/react */
"use client";

export default function AppHeader() {
  return (
    <header css={styles.container}>
      <h1>🚀 Rocketlink</h1>
    </header>
  );
}

const styles = {
  container: (theme) => ({
    backgroundColor: theme.colors.backgroundSecondary,
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
    borderBottom: theme.border,
    height: theme.spacing(9),
  }),
};
