import React, { Fragment } from "react";
import { Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import styles from "./title.style";

function Title({ title }: {title: string}) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  return (
    <Fragment>
      <div className={classes.title}>{title}</div>
      <Divider />
    </Fragment>
  );
}

export default Title;
