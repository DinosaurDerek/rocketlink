"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useFeedPricePolling } from "@/hooks/useFeedPricePolling";

const TokenContext = createContext();

export function TokenProvider({ children }) {
  const [tokens, setTokens] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(null);

  useFeedPricePolling(selectedId, setTokens, setError, setSelectedId);

  const selectedToken = tokens.find((token) => token.id === selectedId) || null;

  return (
    <TokenContext.Provider
      value={{
        tokens,
        selectedToken,
        selectToken: (token) => setSelectedId(token.id),
        error,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

export const useToken = () => useContext(TokenContext);
