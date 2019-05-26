import React from "react";
import classNames from "classnames";
import TextField, { StandardTextFieldProps } from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/styles";
import CustomNumberFormat from "./CustomNumberFormat";
import styles from "./customTextField.style";

interface IProps extends StandardTextFieldProps {}

const CustomNumberTextField = (props: IProps) => {
  const { autoComplete, className, ...rest } = props;

  let ac = "off";
  if (autoComplete !== undefined) ac = autoComplete;

  const useStyles = makeStyles(styles);
  const classes = useStyles();

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
        InputProps={{
          inputComponent: CustomNumberFormat as any
        }}
        className={clsName}
        margin="normal"
        autoComplete={ac}
      />
      <br />
    </>
  );
};

export default CustomNumberTextField;
