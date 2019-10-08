import React from "react";
import { withStyles } from "material-ui/styles";
import classNames from "classnames";

const styles = () => ({
  root: {
    padding: "15px",
    border: "1px solid #e91e639c",
    background: "#f4433612",
    color: "#f44336d6",
    margin: 5,
    width: "100%",
    fontSize: 14,
    borderRadius: 3
  }
});

const ErrorMessage = props => {
  const style = {};

  if (props.show && props.show === true) {
    style.display = "block";
  } else {
    style.display = "none";
  }

  return (
    <div
      className={classNames(props.classes.root, props.className)}
      style={style}
    >
      <span>{props.message}</span>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(ErrorMessage);

/*
    padding: 15px;
    border: 1px solid #e91e639c;
    background: #f4433612;
    color: #f44336d6;
    margin: 25px 0px 10px 0px;
    width: 90%;
    font-size: 14px;
    border-radius: 3px;
*/
