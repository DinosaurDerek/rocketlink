/** @jsxImportSource @emotion/react */
import { keyframes } from "@emotion/react";

export default function Loader() {
  return (
    <div css={styles.container} data-testid="loader">
      <div css={(theme) => styles.dot(0, theme)} />
      <div css={(theme) => styles.dot(0.2, theme)} />
      <div css={(theme) => styles.dot(0.4, theme)} />
    </div>
  );
}

const styles = {
  container: (theme) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(2),
  }),
  dot: (delay, theme) => ({
    width: theme.spacing(1),
    height: theme.spacing(1),
    backgroundColor: theme.colors.primary,
    borderRadius: "50%",
    animation: `${styles.bounce} 1.2s infinite ease-in-out`,
    animationDelay: `${delay}s`,
  }),
  bounce: keyframes`
    0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.6;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
  `,
};
