import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = (theme: Theme) => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: "70px 5px 0px 5px"
  },
  paper: {
    [theme.breakpoints.up("xs")]: {
      width: "calc(100vw - 20px)"
    },
    [theme.breakpoints.up("md")]: {
      width: "calc(100vw - 210px)"
    },
    [theme.breakpoints.up("lg")]: {
      width: "100%"
    },
    height: `calc(100vh - 75px)`,
    overflowX: "auto",
    overflowY: "auto",
    borderRadius: "0px"
  }
});

export default styles;
