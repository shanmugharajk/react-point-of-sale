import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";

import App from "./components/app/App";
import store from "./store";

import registerServiceWorker from "./registerServiceWorker";

import "./index.css";

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Route component={App} />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

registerServiceWorker();
