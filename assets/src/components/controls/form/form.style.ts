import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = theme => ({
  form: {
    marginLeft: 20
  },
  button: {
    margin: "30px 10px 30px 0px"
  }
});

export default styles;
