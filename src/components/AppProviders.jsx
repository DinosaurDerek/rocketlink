"use client";

import { ThemeProvider } from "@emotion/react";

import { theme } from "@/theme";
import { GlobalStyles } from "@/globalStyles";
import { TokenProvider } from "@/context/TokenContext";

export default function AppProviders({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <TokenProvider>
        <GlobalStyles />
        {children}
      </TokenProvider>
    </ThemeProvider>
  );
}
