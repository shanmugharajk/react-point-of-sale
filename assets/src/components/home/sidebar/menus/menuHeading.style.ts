import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = (theme: Theme) => ({
  span: {
    color: "#00000078",
    display: "inline-block",
    margin: "25px 0px 15px 20px",
    textTransform: "capitalize",
    fontSize: 14,
    fontWeight: 500
  }
});

export default styles;
