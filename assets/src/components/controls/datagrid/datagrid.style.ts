import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = theme => ({
  root: {
    width: "100%",
    overflowX: "auto",
    flexShrink: 0
  },
  table: {
    minWidth: 700
  },
  head: {
    background: "#e0e0e0"
  },
  wrapper: {
    position: "relative"
  },
  overlay: {
    top: 0,
    position: "absolute",
    background: "#ffffffad",
    height: "100%",
    width: "100%",
    zIndex: 100
  },
  gridEdit: {
    border: "none",
    minWidth: "29px",
    overflow: "hidden",
    outline: 0,
    lineHeight: 1,
    "&:focus": {
      outline: 0,
      backgroundColor: "#f3f9fd",
      borderRadius: "1px",
      boxShadow: "0 0 0 2px #f3f9fd, 0 0 0 4px #cdd4d9"
    }
  },
  gridNumberEdit: {
    textAlign: "right",
    width: "20px"
  }
});

export default styles;
