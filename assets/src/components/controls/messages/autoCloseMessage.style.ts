import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = theme => ({
  root: {
    margin: 10,
    [theme.breakpoints.up("xs")]: {
      width: 250
    },
    [theme.breakpoints.up("sm")]: {
      width: 300
    },
    [theme.breakpoints.up("md")]: {
      width: 500
    }
  },
  close: {
    fontSize: "12px",
    fontWeight: "bolder",
    float: "right",
    color: "#1f5420",
    cursor: "pointer"
  },
  header: {
    color: "#1a531b",
    paddingBottom: 10,
    fontSize: 15,
    fontWeight: 600
  },
  message: {
    fontSize: 14,
    fontWeight: 400,
    color: "#2c662d",
    padding: 10,
    borderRadius: 2,
    backgroundColor: "#fcfff5",
    boxShadow: "0 0 0 1px #a3c293 inset, 0 0 0 0 transparent"
  },
  errorClose: {
    color: "#e91e63f0"
  },
  error: {
    border: "1px solid #e91e639c",
    background: "#f4433612",
    color: "#f44336d6",
    boxShadow: "0 0 0 1px #fff3f2 inset, 0 0 0 0 transparent"
  },
  errorHeader: {
    color: "#f44336f5"
  }
});

export default styles;
