import React from "react";
import { makeStyles } from "@material-ui/styles";
import styles from "./overlay.style";

const Overlay = () => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  return <div className={classes.root} />;
};

export default Overlay;
