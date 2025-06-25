export const theme = {
  colors: {
    primary: "#8b5cf6",
    primaryHover: "#7c3aed",
    background: "#0d1117",
    backgroundSecondary: "#161b22",
    text: "#e6edf3",
    card: "#1c2128",
    cardHover: "#2f343b",
    focusOutline: "#38bdf8",
    scrollbar: "#6e7681",
  },
  fontSizes: {
    small: "0.8rem",
    medium: "0.9rem",
    large: "1.1rem",
  },
  border: "1px solid #30363d",
  borderRadius: "6px",
  spacing: (factor) => `${factor * 8}px`,
  breakpoints: {
    xs: "@media (max-width: 480px)",
    sm: "@media (max-width: 640px)",
    md: "@media (max-width: 768px)",
  },
};
