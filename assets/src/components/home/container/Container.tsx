import React, { ReactNode } from "react";
import Paper from "@material-ui/core/Paper";

import { makeStyles } from "@material-ui/styles";

import styles from "./container.style";

interface IProps {
  children: ReactNode;
}

const container = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <Paper className={classes.paper} elevation={4}>
        {props.children}
      </Paper>
    </main>
  );
};

export default container;
