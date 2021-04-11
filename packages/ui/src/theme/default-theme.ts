import { createMuiTheme } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";

export const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      main: purple[800],
    },
  },
});
