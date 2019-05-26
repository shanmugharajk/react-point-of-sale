import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = theme => ({
  tab: {
    boxShadow: "none",
    border: "1px solid #e0e0e0"
  },
  tabItem: {
    fontSize: "12px"
  },
  indicator: {
    backgroundColor: "#3f51b5"
  }
});

export default styles;
