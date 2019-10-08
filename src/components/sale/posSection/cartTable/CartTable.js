import React, { Component } from "react";
import currency from "currency.js";
import { connect } from "react-redux";
import { withStyles } from "material-ui/styles";
import { Paper } from "material-ui";
import Table from "material-ui/Table";
import YesNo from "../../../controls/dialog/YesNo";
import EditCartItem from "../editCartItem/EditCartItem";
import CartHeader from "./cartHeader";
import CartBody from "./cartBody";
import CartFooter from "./cartFooter";
import * as cartActions from "../../../../actions/cart";
import { getCartItemsArraySelector } from "../../../../selectors";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  }
});

class CartTable extends Component {
  initialCartItem = {
    id: "",
    name: "",
    qty: "",
    price: "",
    discount: ""
  };

  state = {
    showConfirmDeleteDialog: false,
    showEditDialog: false,
    itemToEdit: this.initialCartItem
  };

  // onChange event for edit cart item form.
  onChange = e => {
    const { itemToEdit } = this.state;
    const clone = {};

    Object.assign(clone, itemToEdit);

    let { qty, discount } = clone;

    if (e.target.name === "discount") {
      discount = e.target.value;
    } else {
      qty = e.target.value;
    }

    const sellingPrice = currency(clone.price).subtract(discount);
    const totalPrice = currency(sellingPrice).multiply(qty);

    clone.qty = qty === "" ? "" : Number(qty);
    clone.discount = discount === "" ? "" : discount;

    clone.sellingPrice = sellingPrice.toString();
    clone.totalPrice = totalPrice.toString();

    this.setState({ itemToEdit: clone });
  };

  // Empty cart dialog
  onConfirmDeleteClick = () => {
    this.props.emptyCart();
    this.setState({ showConfirmDeleteDialog: false });
  };

  onDeleteAllClick = () => {
    this.setState({ showConfirmDeleteDialog: true });
  };

  onDeleteCartItemClick = row => {
    this.props.removeItemFromCart(row);
  };

  onCancelConfirmDeleteClick = () => {
    this.setState({ showConfirmDeleteDialog: false });
  };

  // Edit cart item dialog
  onProductItemClick = itemToEdit => {
    this.setState({ itemToEdit, showEditDialog: true });
  };

  onCancelEditItemClick = () => {
    this.setState({ showEditDialog: false, itemToEdit: this.initialCartItem });
  };

  onSaveItemClick = () => {
    const { itemToEdit } = this.state;

    const clone = {};

    Object.assign(clone, itemToEdit);

    this.props.updateCartItem(itemToEdit);
    this.setState({ showEditDialog: false, itemToEdit: this.initialCartItem });
  };

  render() {
    const { showConfirmDeleteDialog, showEditDialog, itemToEdit } = this.state;
    const { classes, cartObj, cartArray } = this.props;

    return (
      <Paper className={classes.root}>
        <YesNo
          open={showConfirmDeleteDialog}
          message="Are you sure wan't to empty the cart?"
          onOk={this.onConfirmDeleteClick}
          onCancel={this.onCancelConfirmDeleteClick}
        />

        <EditCartItem
          cartObj={cartObj}
          open={showEditDialog}
          item={itemToEdit}
          onSave={this.onSaveItemClick}
          onCancel={this.onCancelEditItemClick}
          onChange={this.onChange}
        />

        <Table>
          <CartHeader
            isCartEmpty={cartArray.length === 0}
            onDeleteAll={this.onDeleteAllClick}
          />
          <CartBody
            cartArray={cartArray}
            onDeleteCartItem={this.onDeleteCartItemClick}
            onProductItemSelect={this.onProductItemClick}
          />
        </Table>
        <CartFooter summary={cartObj.summary} cartArray={cartArray} />
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  return {
    cartArray: getCartItemsArraySelector(state),
    cartObj: state.cart
  };
}

const mapDispatchToProps = {
  emptyCart: cartActions.emptyCart,
  removeItemFromCart: cartActions.removeItemFromCart,
  updateCartItem: cartActions.updateCartItem
};

const component = withStyles(styles, { withTheme: true })(CartTable);

export default connect(mapStateToProps, mapDispatchToProps)(component);
