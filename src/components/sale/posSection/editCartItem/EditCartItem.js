import React, { Component } from "react";
import currency from "currency.js";
import FormDialog from "../../../controls/dialog/FormDialog";
import CustomTextField from "../../../controls/textfields/CustomTextField";
import NumberTextField from "../../../controls/textfields/NumberTextField";
import Footer from "./Footer";

class EditCartItem extends Component {
  state = {
    errors: {}
  };

  onChange = e => {
    this.setState({
      errors: { ...this.state.errors, [e.target.name]: "" }
    });

    this.props.onChange(e);
  };

  onSave = () => {
    const { item } = this.props;

    if (currency(item.discount).value > currency(item.price).value) {
      this.setState({
        errors: {
          ...this.state.errors,
          discount: "Enter the discount value lesser than cost price."
        }
      });
      return;
    }

    if (item.qty === 0) {
      this.setState({
        errors: {
          ...this.state.errors,
          qty: "Qty should be greater than 0."
        }
      });
      return;
    }

    this.setState({ errors: {} });
    this.props.onSave();
  };

  onCancel = () => {
    this.setState({ errors: {} });
    this.props.onCancel();
  };

  render() {
    const { errors } = this.state;
    const { open, item } = this.props;

    return (
      <FormDialog onSave={this.onSave} onCancel={this.onCancel} open={open}>
        <CustomTextField
          error={!!errors.id}
          name="id"
          value={item.id}
          label="Product Id"
          onChange={this.onChange}
          disabled={true}
        />

        <CustomTextField
          error={!!errors.name}
          name="name"
          value={item.name}
          label="Name"
          onChange={this.onChange}
          disabled={true}
        />

        <div style={{ display: "flex" }}>
          <NumberTextField
            error={!!errors.qty}
            name="qty"
            value={item.qty}
            label="Qty"
            onChange={this.onChange}
            helperText={errors.qty}
          />

          <NumberTextField
            error={!!errors.price}
            name="price"
            value={item.price}
            label="Unit Price"
            onChange={this.onChange}
            disabled={true}
          />

          <NumberTextField
            error={!!errors.discount}
            name="discount"
            value={item.discount}
            label="Discount"
            onChange={this.onChange}
            helperText={errors.discount}
          />
        </div>

        <Footer item={item} />
      </FormDialog>
    );
  }
}

export default EditCartItem;
