import React from "react";
import { Switch, Route } from "react-router";
import customer from "../customers";
import expense from "../expense";
import receivings from "../receivings";
import product from "../products";
import vendor from "../vendor";
import sale from "../sale";
import NotFound from "../notFound/NotFound";

const Routes = () => (
  <Switch style={{ overflow: "auto" }}>
    <Route exact path="/" component={() => <div />} />

    {/* Sale */}
    <Route exact path="/sale" component={sale} />

    {/* Receivings */}
    <Route exact path="/receivings" component={receivings.Receivings} />
    <Route exact path="/receivings/new" component={receivings.AddNew} />

    {/* Vendor */}
    <Route exact path="/vendors" component={vendor.Vendors} />
    <Route exact path="/vendors/new" component={vendor.AddNew} />
    <Route exact path="/vendors/edit/:id" component={vendor.AddNew} />

    {/* Customer */}
    <Route exact path="/customers" component={customer.Customers} />
    <Route exact path="/customers/new" component={customer.AddNew} />
    <Route exact path="/customers/edit/:id" component={customer.AddNew} />

    {/* Expense */}
    <Route exact path="/expense" component={expense.Expense} />
    <Route exact path="/expense/new" component={expense.AddNewExpense} />
    <Route exact path="/expense/edit/:id" component={expense.AddNewExpense} />

    {/* Expense Type */}
    <Route exact path="/expensetypes" component={expense.Expense} />
    <Route
      exact
      path="/expensetypes/new"
      component={expense.AddNewExpenseType}
    />
    <Route
      exact
      path="/expensetypes/edit/:id"
      component={expense.AddNewExpenseType}
    />

    {/* Product */}
    <Route exact path="/products" component={product.Products} />
    <Route exact path="/products/new" component={product.AddNewProduct} />
    <Route exact path="/products/edit/:id" component={product.AddNewProduct} />

    {/* Product Type */}
    <Route exact path="/producttypes" component={product.Products} />
    <Route
      exact
      path="/producttypes/new"
      component={product.AddNewProductType}
    />
    <Route
      exact
      path="/producttypes/edit/:id"
      component={product.AddNewProductType}
    />

    {/* Catch : Not found */}
    <Route path="/" component={NotFound} />
  </Switch>
);

export default Routes;
