/** @jsxImportSource @emotion/react */
"use client";

import Image from "next/image";

import { formatPrice } from "@/utils/format";

export default function TokenCard({ onClick, token, isSelected = false }) {
  return (
    <button
      className={isSelected ? "selected" : ""}
      css={[styles.button, isSelected && styles.selected]}
      onClick={onClick}
      data-testid="token-card"
    >
      <div css={styles.nameWrapper}>
        <Image
          src={token.logo}
          alt={token.label}
          css={styles.icon}
          width={20}
          height={20}
        />
        <span data-testid="token-name">{token.label}</span>
      </div>
      <div css={styles.price}>{formatPrice(token.price)}</div>
    </button>
  );
}

const styles = {
  button: (theme) => ({
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.colors.card,
    border: theme.border,
    borderRadius: theme.borderRadius,
    padding: `${theme.spacing(1)} ${theme.spacing(1.25)}`,
    cursor: "pointer",
    color: theme.colors.text,
    fontSize: theme.fontSizes.medium,
    textAlign: "left",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: theme.colors.cardLight,
    },
    "&:focus": {
      outline: `2px solid ${theme.colors.focusOutline}`,
      outlineOffset: "2px",
    },
  }),
  selected: (theme) => ({
    backgroundColor: theme.colors.primary,
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.colors.primary,
    },
    cursor: "auto",
  }),
  nameWrapper: (theme) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  }),
  icon: {
    borderRadius: "50%",
  },
  price: (theme) => ({
    fontSize: theme.fontSizes.small,
    opacity: 0.8,
    paddingLeft: theme.spacing(3.5),
  }),
};
