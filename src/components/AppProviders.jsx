"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@emotion/react";

import { theme } from "@/theme";
import { GlobalStyles } from "@/globalStyles";
import { TokenProvider } from "@/context/TokenContext";

export default function AppProviders({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <ThemeProvider theme={theme}>
      <TokenProvider>
        <GlobalStyles />
        {children}
      </TokenProvider>
    </ThemeProvider>
  );
}
