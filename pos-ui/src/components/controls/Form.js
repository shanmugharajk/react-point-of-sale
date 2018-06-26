import React from "react";
import { withStyles } from "material-ui/styles";
import SubmitCancel from "./SubmitCancel";

// eslint-disable-next-line
const styles = theme => ({
  form: {
    marginLeft: 20
  }
});

const Form = props => (
  <form
    onSubmit={props.onSubmit}
    className={props.classes.form}
    style={props.style}
  >
    {props.children}
    <br />
    <SubmitCancel onCancelClick={props.onCancel} />
  </form>
);

export default withStyles(styles, { withTheme: true })(Form);
