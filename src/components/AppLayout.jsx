/** @jsxImportSource @emotion/react */
"use client";

import AppHeader from "@/components/AppHeader";
import AppSidebar from "@/components/AppSidebar";

export default function AppLayout({ children }) {
  return (
    <div css={styles.container}>
      <AppHeader />
      <div css={styles.content}>
        <AppSidebar />
        <main css={styles.main}>{children}</main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  content: (theme) => ({
    display: "flex",
    flex: 1,
    flexDirection: "row",
    [theme.breakpoints.sm]: {
      flexDirection: "column",
    },
  }),
  main: (theme) => ({
    flex: 1,
    padding: theme.spacing(3),
    height: `calc(100vh - ${theme.spacing(9)})`, // adjust for header height
    overflow: "auto",
    [theme.breakpoints.sm]: {
      height: "auto",
    },
  }),
};
