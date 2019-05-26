import React, { ReactNode } from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/styles";
import styles from "./form.style";
import { Button } from "@material-ui/core";

interface IProps {
  id: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  children: ReactNode;
  clsName?: any;
}

const Form = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const classesForm = [classes.form];

  if (props.clsName) {
    classesForm.push(props.clsName);
  }

  return (
    <form
      id={props.id}
      onSubmit={props.onSubmit}
      className={classNames(classesForm)}
    >
      {props.children}
      <br />
      <Button
        type="submit"
        size="small"
        className={classes.button}
        variant="contained"
        color="primary"
      >
        Submit
      </Button>

      <Button
        size="small"
        className={classes.button}
        variant="contained"
        color="default"
        onClick={props.onCancel}
      >
        Cancel
      </Button>
    </form>
  );
};

Form.defaultProps = {
  clsName: {}
};

export default Form;
