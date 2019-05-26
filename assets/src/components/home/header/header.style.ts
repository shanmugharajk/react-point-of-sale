import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (
  drawerWidth: number
) => (theme: Theme) => StyleRules<any, any> = (drawerWidth) => (
  theme: Theme
) => ({
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up("lg")]: {
      display: "none"
    }
  }
});

export default styles;
