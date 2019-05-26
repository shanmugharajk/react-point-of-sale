import { StyleRules } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

const styles: (theme: Theme) => StyleRules<any, any> = () => ({
  loader: {
    position: "absolute",
    left: "50%",
    top: "25vh",
    zIndex: 102
  }
});

export default styles;
