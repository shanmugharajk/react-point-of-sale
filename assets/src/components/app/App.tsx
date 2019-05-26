import React from "react";

import { ThemeProvider } from "@material-ui/styles";
import { Switch, Route } from "react-router";

import Login from "../../pages/login/Login";
import PrivateRoute from "../../pages/routes/PrivateRoute";
import theme from "../../themes/theme";
import Home from "../../pages/home/Home";
import { updateAuthorizationHeader } from "../../libs/axiosClient";

// Required to set token on the page refresh.
updateAuthorizationHeader();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/login" component={Login} />
        <PrivateRoute path="/" component={Home} />
      </Switch>
    </ThemeProvider>
  );
}

export default App;
