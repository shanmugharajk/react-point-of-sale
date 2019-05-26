import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = theme => ({
  form: {
    marginLeft: 20
  },
  wrapper: {
    position: "relative"
  }
});

export default styles;
