"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { TOKENS as STATIC_TOKENS } from "@/constants";
import { fetchTokenFeedPrices } from "@/utils/contractUtils";

const TokenContext = createContext();

export function TokenProvider({ children }) {
  const [tokens, setTokens] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const intervalMs = 45000;
    let intervalId;

    const update = () => {
      fetchTokenFeedPrices(
        STATIC_TOKENS,
        setTokens,
        setError,
        selectedId,
        setSelectedId
      );
    };

    const onVisibilityChange = () => {
      document.visibilityState === "visible"
        ? update()
        : clearInterval(intervalId);
    };

    if (document.visibilityState === "visible") {
      update();
      intervalId = setInterval(update, intervalMs);
    }

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [selectedId]);

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
