import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = () => ({
  root: {
    borderTop: "1px solid #3f50b5",
    padding: "10px 5px 5px 5px",
    position: "relative"
  }
});

export default styles;
