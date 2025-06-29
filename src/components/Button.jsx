/** @jsxImportSource @emotion/react */
"use client";

export default function Button({ children, onClick, disabled = false }) {
  return (
    <button css={styles.button} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

const styles = {
  button: (theme) => ({
    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
    backgroundColor: theme.colors.primary,
    color: "#fff",
    border: "none",
    borderRadius: theme.borderRadius,
    cursor: "pointer",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: theme.colors.primaryHover,
    },
    "&:disabled": {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
  }),
};
