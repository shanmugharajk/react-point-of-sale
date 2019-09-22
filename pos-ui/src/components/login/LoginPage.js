import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";
import { CircularProgress } from "material-ui/Progress";
import Button from "material-ui/Button";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import ErrorMessage from "../controls/messages/ErrorMessage";
import { loginUser } from "../../actions/auth";

import styles from "./styles";

class LoginPage extends Component {
  state = {
    data: {
      username: "",
      password: ""
    },
    loading: false,
    errors: {}
  };

  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.props.history.push("/home");
    } else {
      this.props.history.push("/");
    }
  }

  hasErrors = () =>
    this.state.errors.global && this.state.errors.global.length > 0;

  onSubmit = async e => {
    e.preventDefault();

    const errors = this.validate(this.state.data);
    this.setState({ errors });

    if (Object.keys(errors).length !== 0) {
      return;
    }

    this.setState({ loading: true });

    try {
      await this.props.loginUser({ ...this.state.data });
      this.props.history.push("/");
    } catch (error) {
      this.setState({
        errors: { global: error.message },
        data: { username: "", password: "" },
        loading: false
      });

      if (this.usernameRef) this.usernameRef.focus();
    }
  };

  onChange = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });
  };

  validate = data => {
    const errors = {};

    if (!data.username || data.username.length === 0)
      errors.username = "Enter username";

    if (!data.password || data.password.length === 0)
      errors.password = "Enter password";

    return errors;
  };

  render() {
    const { classes } = this.props;
    const { loading, data, errors } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.loginContainer}>
          <Paper className={classes.paper}>
            <form onSubmit={this.onSubmit}>
              <div>
                <span>Welcome to Easy POS</span>
              </div>

              <ErrorMessage
                show={this.hasErrors()}
                className={classes.errorMessage}
                message={errors.global}
              />

              <TextField
                inputRef={input => {
                  this.usernameRef = input;
                }}
                error={!!errors.username}
                name="username"
                value={data.username}
                fullWidth
                label="Username"
                placeholder="Username"
                margin="normal"
                onChange={this.onChange}
              />
              <TextField
                error={!!errors.password}
                name="password"
                value={data.password}
                fullWidth
                label="Password"
                placeholder="Password"
                type="password"
                margin="normal"
                onChange={this.onChange}
              />

              <div className={classes.wrapper}>
                <Button
                  type="submit"
                  variant="raised"
                  color="primary"
                  disabled={loading}
                >
                  Login
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
            </form>
          </Paper>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const isLoggedIn = state.auth !== undefined ? !!state.auth.tokens : false;

  return {
    isLoggedIn
  };
}

const component = withStyles(styles, { withTheme: true })(LoginPage);

export default withRouter(
  connect(
    mapStateToProps,
    { loginUser }
  )(component)
);
