import { StyleRules } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

const styles: (theme: Theme) => StyleRules<any, any> = theme => ({
  root: {
    padding: 10
  },
  tabHolder: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  tab: {
    boxShadow: "none"
  },
  tabItem: {
    fontSize: "12px"
  },
  indicator: {
    backgroundColor: "#3f51b5"
  }
});

export default styles;
