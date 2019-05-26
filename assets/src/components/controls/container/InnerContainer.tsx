import React, {  ReactNode } from "react";
import Title from "../title/Title";
import { makeStyles } from "@material-ui/styles";
import styles from "./innerContainer.style";

interface IProps {
  title?: string;
  children: ReactNode;
}

const Container = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {props.title && <Title title={props.title} />}
      <br />
      <div>{props.children}</div>
    </div>
  );
};

export default Container;
