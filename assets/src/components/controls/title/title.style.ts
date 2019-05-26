import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = () => ({
  title: {
    color: "#000000a3",
    lineHeight: 1.1,
    margin: 0,
    paddingBottom: 8,
    fontSize: 18,
    fontWeight: 400,
    display: "inline-block",
    borderBottom: "3px solid #3f50b5"
  }
});

export default styles;
