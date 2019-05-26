import React, { useState, ChangeEvent } from "react";

import { Paper, Button, TextField } from "@material-ui/core";

import { History } from "history";
import { withRouter } from "react-router";
import { makeStyles } from "@material-ui/styles";

import loginService from "./loginService";
import ErrorMessage from "../../components/controls/messages/ErrorMessage";
import useAuth from "../../hooks/useAuth";
import styles from "./login.style";

interface IState {
  username: string;
  password: string;
}

interface IProps {
  history: History;
}

const LoginPage = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [error, setError] = useState("");
  const [, saveToken] = useAuth();

  const [values, setValues]: [IState | any, any] = useState({});

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    if (error) {
      setError("");
    }
  };

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const token = await loginService.login(values);
      (saveToken as any)(token);
      props.history.push("/");
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const validate = (values: any) => {
    const errors: any = {};
    if (!values.username) {
      errors.username = "Required";
    }
    if (!values.password) {
      errors.password = "Required";
    }
    return errors;
  };

  const hasErrors = () => Object.keys(validate(values)).length > 0;

  return (
    <div className={classes.root}>
      <div className={classes.loginContainer}>
        <Paper className={classes.paper}>
          <form onSubmit={onSubmit}>
            <div>
              <span>Welcome to Easy POS</span>
            </div>

            <ErrorMessage
              show={!!error}
              className={classes.errorMessage}
              message={error}
            />

            <TextField
              name="username"
              fullWidth
              label="Username"
              placeholder="Username"
              autoComplete="username"
              margin="normal"
              onChange={onChange}
            />

            <TextField
              name="password"
              fullWidth
              label="Password"
              placeholder="Password"
              type="password"
              margin="normal"
              autoComplete="current-password"
              onChange={onChange}
            />

            <div className={classes.wrapper}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={hasErrors()}
              >
                Login
              </Button>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default withRouter(LoginPage);
