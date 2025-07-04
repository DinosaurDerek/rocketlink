"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { readPriceFromFeed } from "@/utils/contractUtils";
import { TOKENS as STATIC_TOKENS } from "@/constants";

const TokenContext = createContext();

export function TokenProvider({ children }) {
  const [tokens, setTokens] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const FEED_POLL_INTERVAL = 45000;
    let isMounted = true;
    let intervalId;

    async function loadFeeds() {
      try {
        const updated = await Promise.all(
          STATIC_TOKENS.map(async (token) => {
            try {
              const price = await readPriceFromFeed(token.feedAddress);
              return { ...token, price };
            } catch {
              return token;
            }
          })
        );

        if (!isMounted) return;
        setTokens(updated);
        setError(null);

        if (selectedId === null && updated.length) {
          setSelectedId(updated[0].id);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load feed prices:", err);
        setError(err);
      }
    }

    function startPolling() {
      loadFeeds(); // Immediate on focus
      intervalId = setInterval(loadFeeds, FEED_POLL_INTERVAL);
    }

    function stopPolling() {
      clearInterval(intervalId);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        startPolling();
      } else {
        stopPolling();
      }
    }

    // Initial mount
    if (document.visibilityState === "visible") {
      startPolling();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
