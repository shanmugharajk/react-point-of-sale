import React from "react";
import { makeStyles } from "@material-ui/styles";
import styles from "./menuHeading.style";

interface IProps {
  title: string;
}

const MenuHeading = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  return <span className={classes.span}>{props.title.toUpperCase()}</span>;
};

export default MenuHeading;
