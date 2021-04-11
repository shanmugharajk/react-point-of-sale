import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";

import { defaultTheme } from "theme";

export const App: React.FunctionComponent = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      React POS
    </ThemeProvider>
  );
};
