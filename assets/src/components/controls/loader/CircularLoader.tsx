import React from "react";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import Overlay from "../overlay/Overlay";
import styles from "./circularLoader.style";

interface IProps {
  isLoading: boolean;
  style: any;
}

const CircularLoader = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  if (props.isLoading === true) {
    return (
      <div>
        <CircularProgress
          size={50}
          className={classes.loader}
          style={props.style}
        />
        <Overlay />
      </div>
    );
  }

  return null;
};

CircularLoader.defaultProps = {
  style: {}
};

export default CircularLoader;
