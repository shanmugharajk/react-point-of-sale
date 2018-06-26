import React, { Fragment } from "react";
import Divider from "material-ui/Divider";
import { withStyles } from "material-ui";

// eslint-disable-next-line
const styles = theme => ({
  title: {
    color: "#000000a3",
    lineHeight: 1.1,
    margin: 0,
    paddingBottom: 8,
    fontSize: 18,
    fontWeight: 400,
    display: "inline-block",
    borderBottom: "3px solid #3f50b5"
  }
});

function Title({ classes, title }) {
  return (
    <Fragment>
      <div className={classes.title}>{title}</div>
      <Divider />
    </Fragment>
  );
}

export default withStyles(styles, { withTheme: true })(Title);
