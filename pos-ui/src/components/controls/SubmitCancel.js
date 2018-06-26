import React, { Fragment } from "react";
import Button from "material-ui/Button";
import { withStyles } from "material-ui/styles";

// eslint-disable-next-line
const styles = theme => ({
  button: {
    margin: "30px 10px 30px 0px"
  }
});

const SubmitCancel = ({ classes, onCancelClick }) => (
  <Fragment>
    <Button
      type="submit"
      size="small"
      className={classes.button}
      variant="raised"
      color="primary"
    >
      Submit
    </Button>

    <Button
      size="small"
      className={classes.button}
      variant="raised"
      color="default"
      onClick={onCancelClick}
    >
      Cancel
    </Button>
  </Fragment>
);

export default withStyles(styles, { withTheme: true })(SubmitCancel);
