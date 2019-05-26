import React from "react";
import { Route, Redirect } from "react-router";
import loginService from "../login/loginService";

interface IProps {
  component: any;
  exact?: boolean;
  path: string;
}

const PrivateRoute = (props: IProps) => {
  const { component: C, ...rest }: { component: any } = props;

  return (
    <Route
      {...rest}
      render={props =>
        loginService.isAuthenticated() === true ? (
          <C {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
