import React, { Component, Fragment } from "react";
import { withStyles } from "material-ui/styles";
import Clear from "material-ui-icons/Clear";
import classNames from "classnames";

const styles = theme => ({
  root: {
    margin: 10,
    [theme.breakpoints.up("xs")]: {
      width: 250
    },
    [theme.breakpoints.up("sm")]: {
      width: 300
    },
    [theme.breakpoints.up("md")]: {
      width: 500
    }
  },
  close: {
    fontSize: "12px",
    fontWeight: "bolder",
    float: "right",
    color: "#1f5420",
    cursor: "pointer"
  },
  header: {
    color: "#1a531b",
    paddingBottom: 10,
    fontSize: 15,
    fontWeight: 600
  },
  message: {
    fontSize: 14,
    fontWeight: 400,
    color: "#2c662d",
    padding: 10,
    borderRadius: 2,
    backgroundColor: "#fcfff5",
    boxShadow: "0 0 0 1px #a3c293 inset, 0 0 0 0 transparent"
  },
  errorClose: {
    color: "#e91e63f0"
  },
  error: {
    border: "1px solid #e91e639c",
    background: "#f4433612",
    color: "#f44336d6",
    boxShadow: "0 0 0 1px #fff3f2 inset, 0 0 0 0 transparent"
  },
  errorHeader: {
    color: "#f44336f5"
  }
});

class Message extends Component {
  state = {};

  render() {
    const {
      classes,
      title,
      message,
      style,
      show,
      onCloseClick,
      isError,
      autoClose,
      className
    } = this.props;

    if (show === true && autoClose === true) {
      setTimeout(() => {
        this.props.onCloseClick();
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
      <Fragment>
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
      </Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Message);
