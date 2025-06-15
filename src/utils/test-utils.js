import { render } from "@testing-library/react";
import { ThemeProvider } from "@emotion/react";

import { theme } from "@/theme";

const customRender = (ui, options) =>
  render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    ),
    ...options,
  });

export * from "@testing-library/react";
export { customRender as render };
