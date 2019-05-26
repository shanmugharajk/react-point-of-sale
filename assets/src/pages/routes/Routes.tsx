import React from "react";
import { Switch, Route } from "react-router";
import NotFound from "../../components/notFound/NotFound";
import PrivateRoute from "./PrivateRoute";
import Products from "../products/Products";
import ProductForm from "../products/ProductForm";

const Routes = () => (
  // TODO: why overflow: auto ??
  <div style={{ overflow: "auto" }}>
    <Switch>
      <PrivateRoute exact path="/" component={() => <div />} />

      {/* Product */}
      <PrivateRoute exact path="/products" component={Products} />
      <PrivateRoute exact path="/product-types" component={Products} />
      <Route exact path="/products/new" component={ProductForm} />
      <Route exact path="/products/edit/:id" component={ProductForm} />

      {/* Catch : Not found */}
      <Route path="/" component={NotFound} />
    </Switch>
  </div>
);

export default Routes;
