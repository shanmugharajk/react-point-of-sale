import React from "react";
import { withStyles } from "material-ui/styles";

const styles = () => ({
  root: {
    margin: 10
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
  }
});

const SuccessMessage = props => {
  const { classes, title, message } = props;

  return (
    <div className={classes.root}>
      <div className={classes.message}>
        <div className={classes.header}> {title} </div>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default withStyles(styles)(SuccessMessage);
