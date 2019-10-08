import React, { Fragment } from "react";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import TextField from "material-ui/TextField";
import NumberFormatCustom from "./NumberFormatCustom";

// eslint-disable-next-line
//  TODO remove this and make it common if textfield and this has same styles.
const styles = theme => ({
  textField: {
    [theme.breakpoints.up("xs")]: {
      width: 250
    },
    [theme.breakpoints.up("sm")]: {
      width: 300
    },
    [theme.breakpoints.up("md")]: {
      width: 500
    },
    marginRight: 10
  },
  textFieldFormLabel: {
    fontSize: "1.05rem"
  }
});

const NumberTextField = props => {
  const { classes, autoComplete, className, ...rest } = props;
  let ac = "off";
  if (autoComplete !== undefined) ac = autoComplete;

  let clsName = classes.textField;
  if (className) {
    clsName = classNames(classes.textField, className);
  }

  return (
    <Fragment>
      <TextField
        {...rest}
        InputLabelProps={{
          shrink: true,
          className: classes.textFieldFormLabel
        }}
        InputProps={{
          inputComponent: NumberFormatCustom
        }}
        className={clsName}
        margin="normal"
        autoComplete={ac}
      />
      <br />
    </Fragment>
  );
};

export default withStyles(styles, { withTheme: true })(NumberTextField);
