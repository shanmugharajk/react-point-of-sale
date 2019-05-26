import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = theme => ({
  root: {
    [theme.breakpoints.up("xs")]: {
      float: "none"
    },
    [theme.breakpoints.up("md")]: {
      float: "right"
    }
  },
  textfield: {
    width: 200
  }
});

export default styles;
