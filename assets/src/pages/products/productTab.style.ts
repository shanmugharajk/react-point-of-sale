import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = theme => ({
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  },
  iconSmall: {
    fontSize: 20
  },
  wrapper: {
    marginTop: 20,
    position: "relative"
  }
});

export default styles;
