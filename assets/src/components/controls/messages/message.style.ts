import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = () => ({
  root: {
    margin: 10
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
  }
});

export default styles;
