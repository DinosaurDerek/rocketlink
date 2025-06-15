/** @jsxImportSource @emotion/react */
export default function Message({ text }) {
  return <p css={styles.message}>{text}</p>;
}

const styles = {
  message: (theme) => ({
    color: theme.colors.focusOutline,
    backgroundColor: theme.colors.card,
    border: theme.border,
    borderRadius: theme.borderRadius,
    padding: theme.spacing(1),
    fontSize: theme.fontSizes.small,
    textAlign: "center",
  }),
};
