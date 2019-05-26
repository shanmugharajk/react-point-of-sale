import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/styles";
import styles from "./errorMessage.style";

interface IProps {
  show: boolean;
  className?: string;
  message: string;
}

const ErrorMessage = ({ className, message, show }: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const style: {
    display?: string;
  } = {};

  if (show && show === true) {
    style.display = "block";
  } else {
    style.display = "none";
  }

  return (
    <div className={classNames(classes.root, className)} style={style}>
      <span>{message}</span>
    </div>
  );
};

ErrorMessage.defaultProps = {
  className: ""
};

export default ErrorMessage;
