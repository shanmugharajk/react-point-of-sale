import React, { Component } from "react";
import currency from "currency.js";
import { connect } from "react-redux";
import { Switch, withStyles } from "material-ui";
import FormDialog from "../../../../controls/dialog/FormDialog";
import NumberTextField from "../../../../controls/textfields/NumberTextField";
import {
  updateDiscountOnItems,
  updateDiscountOnTotal
} from "../../../../../actions/cart";

const styles = () => ({
  switch: {
    marginLeft: "-20px"
  },
  label: {
    fontSize: "13px",
    fontWeight: 400
  }
});

class DiscountPopup extends Component {
  initialState = {
    discount: "",
    checkedB: false,
    error: "",
    discountText: "Apply to order total"
  };

  state = {
    ...this.initialState
  };

  onDiscountChange = e => {
    let discount = "";
    const { value } = e.target;

    if (value !== "") {
      discount = e.target.value;
    }

    this.setState({ discount, error: "" });
  };

  onCancel = () => {
    this.setState({ ...this.initialState });
    this.props.close();
  };

  onSave = () => {
    const { checkedB } = this.state;
    const { discount } = this.state;

    if (discount === "") {
      this.setState({ error: "Enter value" });
      return;
    }

    const applyToAllItems = checkedB === true;

    if (applyToAllItems === true) {
      this.updateDiscountOnItems(discount);
    } else {
      this.updateDiscountOnTotal(discount);
    }
  };

  updateDiscountOnTotal = discount => {
    const { summary } = this.props;

    if (currency(summary.total).value < discount) {
      this.setState({
        error: "Discount entered is greater than the net total price."
      });
      return;
    }

    this.props.updateDiscountOnTotal(discount);
    this.setState({ ...this.initialState });
    this.props.close();
  };

  updateDiscountOnItems = discount => {
    const itemWithPriceLessThanDiscount = this.props.cartArray.filter(
      i => currency(i.price).value < discount
    );

    if (itemWithPriceLessThanDiscount.length > 0) {
      this.setState({
        error: "Discount entered is greater cost price of item(s)"
      });
      return;
    }

    this.props.updateDiscountOnItems(discount);
    this.setState({ ...this.initialState });
    this.props.close();
  };

  handleChange = () => {
    const checkedB = !this.state.checkedB;

    if (checkedB === true) {
      this.setState({ discountText: "Apply to all items", checkedB });
    } else {
      this.setState({ discountText: "Apply to order total", checkedB });
    }
  };

  render() {
    const { discount, error, checkedB, discountText } = this.state;
    const { open, classes } = this.props;

    return (
      <FormDialog
        onSave={this.onSave}
        onCancel={this.onCancel}
        open={open}
        title="Discount"
      >
        <NumberTextField
          style={{ width: "250px" }}
          error={!!error}
          name="discount"
          value={discount}
          label="Amount"
          onChange={this.onDiscountChange}
          helperText={error}
        />
        <div>
          <Switch
            className={classes.switch}
            checked={checkedB}
            onChange={this.handleChange}
            value="checkedB"
            color="primary"
          />
          <span className={classes.label}>{discountText}</span>
        </div>
      </FormDialog>
    );
  }
}

export default connect(null, { updateDiscountOnItems, updateDiscountOnTotal })(
  withStyles(styles)(DiscountPopup)
);
