import { createMuiTheme } from "@material-ui/core";
import { deepPurple } from "@material-ui/core/colors";

export const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      main: deepPurple[500],
    },
  },
});
