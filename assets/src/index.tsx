import "./index.css";

import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route } from "react-router-dom";

import App from "./components/app/App";

(window as any).__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

ReactDOM.render(
  <BrowserRouter>
    <Route component={App} />
  </BrowserRouter>,
  document.getElementById("root")
);
