import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (
  drawerWidth: number
) => (theme: Theme) => StyleRules<any, any> = (drawerWidth: number) => (
  theme: Theme
) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    borderBottom: "1px solid #e0e0e0"
  },
  drawer: {
    [theme.breakpoints.up("lg")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  }
});

export default styles;
