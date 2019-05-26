import React from "react";
import classNames from "classnames";
import TextField, { StandardTextFieldProps } from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/styles";
import styles from "./customTextField.style";

interface IProps extends StandardTextFieldProps {}

const CustomTextField = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const { autoComplete, className, ...rest } = props;
  let ac = "off";
  if (autoComplete !== undefined) ac = autoComplete;

  let clsName = classes.textField;
  if (className) {
    clsName = classNames(classes.textField, className);
  }

  return (
    <>
      <TextField
        {...rest}
        InputLabelProps={{
          shrink: true,
          className: classes.textFieldFormLabel
        }}
        className={clsName}
        margin="normal"
        autoComplete={ac}
      />
      <br />
    </>
  );
};

export default CustomTextField;
