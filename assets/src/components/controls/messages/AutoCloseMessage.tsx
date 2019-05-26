import React from "react";
import classNames from "classnames";
import Clear from "@material-ui/icons/Clear";

import { makeStyles } from "@material-ui/styles";

import styles from "./autoCloseMessage.style";

interface IProps {
  title?: string;
  message: string;
  style?: any;
  show: boolean;
  isError?: boolean;
  autoClose?: boolean;
  className?: string;
  onCloseClick: () => void;
}

const AutoCloseMessage = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const {
    title,
    message,
    style,
    show,
    onCloseClick,
    isError,
    autoClose,
    className
  } = props;

  if (show === true && autoClose === true && onCloseClick) {
    setTimeout(() => {
      onCloseClick();
    }, 3000);
  }

  let headerClass = classes.header;
  let messageContainerClass = classes.message;
  let errorClose = classes.close;

  if (isError === true) {
    headerClass = classNames(classes.header, classes.errorHeader);
    messageContainerClass = classNames(classes.message, classes.error);
    errorClose = classNames(classes.close, classes.errorClose);
  }

  let root = "";

  if (className) {
    root = classNames(classes.root, className);
  } else {
    // eslint-disable-next-line prefer-destructuring
    root = classes.root;
  }

  return (
    <>
      {show === true && (
        <div className={root} style={style}>
          <div className={messageContainerClass}>
            {onCloseClick && (
              <Clear className={errorClose} onClick={onCloseClick} />
            )}
            {title && <div className={headerClass}> {title} </div>}
            <span>{message}</span>
          </div>
        </div>
      )}
    </>
  );
};

AutoCloseMessage.defaultProps = {
  style: {}
};

export default AutoCloseMessage;
