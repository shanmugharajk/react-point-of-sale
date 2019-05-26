import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = (theme: Theme) => ({
  listItem: {
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      "& $primary, & $icon": {
        color: theme.palette.common.white
      }
    },
    padding: "7px 0px 7px 20px"
  },
  primary: {
    fontSize: 14,
    paddingLeft: 5
  },
  icon: {
    width: 19
  },
  selected: {
    backgroundColor: "#00000014",
    borderLeft: "5px solid",
    borderColor: theme.palette.primary.main,
    paddingLeft: 20
  },
  normal: {
    backgroundColor: "white"
  }
});

export default styles;
