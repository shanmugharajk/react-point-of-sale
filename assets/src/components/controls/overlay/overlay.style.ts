import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = () => ({
  root: {
    top: 0,
    position: "absolute",
    background: "#ffffffad",
    height: "100%",
    width: "100%",
    zIndex: 100
  }
});

export default styles;
