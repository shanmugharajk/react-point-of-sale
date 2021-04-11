import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";

import { defaultTheme } from "theme";
import { LoginView } from "views";

export const App: React.FunctionComponent = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <LoginView />
    </ThemeProvider>
  );
};
