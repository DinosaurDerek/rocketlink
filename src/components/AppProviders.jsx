"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@emotion/react";

import { theme } from "@/theme";
import { GlobalStyles } from "@/globalStyles";
import { TokenProvider } from "@/context/TokenContext";
import { TOKENS } from "@/constants";

export default function AppProviders({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by rendering only on client
  // Note: Causes double fetch in dev due to React Strict Mode, but safe in prod
  if (!isClient) return null;

  return (
    <ThemeProvider theme={theme}>
      <TokenProvider initialToken={TOKENS[0]}>
        <GlobalStyles />
        {children}
      </TokenProvider>
    </ThemeProvider>
  );
}
