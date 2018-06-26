import React from "react";
import { withStyles } from "material-ui/styles";

const styles = () => ({
  root: {
    top: 0,
    position: "absolute",
    background: "#ffffffad",
    height: "100%",
    width: "100%",
    zIndex: 100
  }
});

const Overlay = ({ classes }) => <div className={classes.root} />;

export default withStyles(styles)(Overlay);
