/** @jsxImportSource @emotion/react */
"use client";

import TokenList from "./TokenList";

export default function AppSidebar() {
  return (
    <aside css={styles.container}>
      <TokenList />
    </aside>
  );
}

const styles = {
  container: (theme) => ({
    width: "200px",
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing(2),
    borderRight: theme.border,
    height: `calc(100vh - ${theme.spacing(9)})`, // adjusted for header height
    overflowY: "auto",
    [theme.breakpoints.sm]: {
      position: "static",
      width: "100%",
      height: "auto",
      borderRight: "none",
      borderBottom: theme.border,
    },
  }),
};
