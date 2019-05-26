import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = (theme: any) => ({
  toolbar: theme.mixins.toolbar,
  logo: {
    background: theme.palette.primary.main,
    padding: "18px 5px 5px 15px",
    display: "flex",
    color: "white",
    "& > span": {
      padding: "0px 0px 0px 15px",
      fontSize: 18,
      fontWeight: "lighter"
    }
  }
});

export default styles as any;
