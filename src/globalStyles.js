"use client";

import { css, Global, useTheme } from "@emotion/react";

export const GlobalStyles = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: system-ui, sans-serif;
          background-color: ${theme.colors.background};
          color: ${theme.colors.text};
        }

        /* Scrollbar styles */
        *::-webkit-scrollbar {
          width: ${theme.spacing(1)};
          height: ${theme.spacing(1)};
        }

        *::-webkit-scrollbar-track {
          background: ${theme.colors.background};
        }

        *::-webkit-scrollbar-thumb {
          background-color: ${theme.colors.scrollbar};
          border-radius: ${theme.spacing(0.5)};
        }

        *::-webkit-scrollbar-thumb:hover {
          background-color: ${theme.colors.scrollbar};
        }

        /* Firefox support */
        * {
          scrollbar-width: thin;
          scrollbar-color: ${theme.colors.scrollbar} ${theme.colors.background};
        }
      `}
    />
  );
};
