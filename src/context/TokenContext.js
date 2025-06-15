"use client";

import { createContext, useContext, useState } from "react";

const TokenContext = createContext();

export const TokenProvider = ({ children, initialToken }) => {
  const [selectedToken, setSelectedToken] = useState(initialToken);

  return (
    <TokenContext.Provider value={{ selectedToken, setSelectedToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);
