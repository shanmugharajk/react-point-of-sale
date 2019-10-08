import React, { Component } from "react";
import * as equal from "fast-deep-equal";
import { withRouter } from "react-router";
import { withStyles } from "material-ui/styles";
import Container from "../controls/Container";
import Form from "../controls/Form";
import Dropdown from "../controls/dropdown/Dropdown";
import CircularLoader from "../controls/loader/CircularLoader";
import api from "../../api";
import NumberTextField from "../controls/textfields/NumberTextField";
import { isValueExists } from "../../utils";
import Message from "../controls/Message";
import Prompt from "../controls/dialog/Prompt";
import CustomDatePicker from "../controls/pickers/CustomDatePicker";

// eslint-disable-next-line
const styles = theme => ({
  form: {
    marginLeft: 20
  },
  wrapper: {
    position: "relative"
  }
});

class AddNew extends Component {
  initialData = {
    productId: "pen",
    vendorId: "mrlabs",
    qty: "1",
    price: "100",
    paid: "100",
    date: new Date()
  };

  state = {
    data: this.initialData,
    errors: {},
    showMessageDialog: false,
    productIds: [],
    vendorIds: [],
    isLoading: false,
    message: false,
    showMessage: false,
    isError: false,
    isEdit: false
  };

  async componentDidMount() {
    this.setState({ isLoading: true });

    try {
      const stateToUpdate = {};

      const productPromise = await api.product.fetchAll();
      const productIds = productPromise.data.map(d => ({
        value: d.id,
        label: d.id
      }));

      const vendorPromise = await api.vendor.fetchAll();
      const vendorIds = vendorPromise.data.map(d => ({
        value: d.id,
        label: d.id
      }));

      stateToUpdate.productIds = productIds;
      stateToUpdate.vendorIds = vendorIds;
      stateToUpdate.isLoading = false;

      const { id } = this.props.match.params;

      if (id) {
        const receivingPromise = await api.receiving.fetchById(id);
        const toEdit = receivingPromise.data;
        stateToUpdate.data = toEdit;
        stateToUpdate.isEdit = true;
      }

      this.setState({ ...stateToUpdate });
    } catch (error) {
      this.showMessage(error.message, true);
    }
  }

  onChange = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value },
      errors: { ...this.state.errors, [e.target.name]: "" }
    });
  };

  onProductIdDropdownChange = value => {
    const productId = value === null ? "" : value;

    this.setState({
      data: { ...this.state.data, productId },
      errors: { ...this.state.errors, productId: "" }
    });
  };

  onVendorIdDropdownChange = value => {
    const vendorId = value === null ? "" : value;

    this.setState({
      data: { ...this.state.data, vendorId },
      errors: { ...this.state.errors, vendorId: "" }
    });
  };

  onCancelClick = () => {
    const isDirty = !equal(this.initialData, this.state.data);
    if (isDirty === true && this.state.isEdit === false) {
      this.clearForm();
      return;
    }
    this.props.history.goBack();
  };

  onSubmit = async e => {
    e.preventDefault();

    const errors = isValueExists(this.state.data);

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    try {
      this.state.data.price = Number(this.state.data.price);
      this.state.data.paid = Number(this.state.data.paid);
      this.state.data.qty = Number(this.state.data.qty);

      if (this.state.isEdit === false) {
        await this.createNew(this.state.data);
      } else {
        await this.update(this.state.data);
      }
    } catch (error) {
      this.showError(error);
    }
  };

  createNew = async data => {
    const res = await api.receiving.createNew(data);

    if (res.status === 200) {
      this.showMessage("Saved successfully");
      this.clearForm();
    } else {
      throw new Error(
        `Unable to create the record. The status code is ${res.status}`
      );
    }
  };

  update = async data => {
    const res = await api.receiving.update(this.props.match.params.id, data);

    if (res.status === 200) {
      this.clearForm(true);
    } else {
      throw new Error(`Unable to update. The status code is ${res.status}`);
    }
  };

  clearForm = (canShowMessageDialog = false) => {
    this.setState({
      data: this.initialData,
      showMessageDialog: canShowMessageDialog
    });

    if (this.idRef) {
      this.idRef.focus();
    }
  };

  onMessageCloseClick = () => {
    this.setState({
      showMessage: false,
      message: "",
      isError: false
    });
  };

  showMessage = message => {
    this.setState({
      showMessage: true,
      message,
      isError: false
    });
  };

  showError = error => {
    this.setState({
      showMessage: true,
      message: error.message,
      isError: true,
      isLoading: false
    });
  };

  onMessageDialogCloseClick = () => {
    this.setState({ showMessageDialog: false });
    this.props.history.goBack();
  };

  render() {
    const { classes } = this.props;
    const {
      data,
      errors,
      isLoading,
      productIds,
      vendorIds,
      showMessage,
      isError,
      message,
      isEdit,
      showMessageDialog
    } = this.state;

    return (
      <Container title={isEdit ? "Edit Receiving" : "Add new receiving"}>
        <Prompt
          message="The item you entered was saved successfully."
          open={showMessageDialog}
          handleClose={this.onMessageDialogCloseClick}
        />
        <CircularLoader isLoading={isLoading} />
        <Message
          title="Message"
          message={message}
          show={showMessage}
          isError={isError}
          onCloseClick={this.onMessageCloseClick}
          autoClose={!isError}
        />
        <Form
          id="AddNew"
          onSubmit={this.onSubmit}
          onCancel={this.onCancelClick}
          className={classes.form}
        >
          <Dropdown
            name="productId"
            value={data.productId}
            error={!!errors.productId}
            datasource={productIds}
            onChange={this.onProductIdDropdownChange}
            placeholder=""
            label="Products"
          />

          <Dropdown
            name="vendorId"
            value={data.vendorId}
            error={!!errors.vendorId}
            datasource={vendorIds}
            onChange={this.onVendorIdDropdownChange}
            placeholder=""
            label="Vendors"
          />

          <NumberTextField
            error={!!errors.qty}
            name="qty"
            value={data.qty}
            label="Qty"
            onChange={this.onChange}
          />

          <NumberTextField
            error={!!errors.price}
            name="price"
            value={data.price}
            label="Price"
            onChange={this.onChange}
          />

          <NumberTextField
            error={!!errors.paid}
            name="paid"
            value={data.paid}
            label="Enter amount Paid"
            onChange={this.onChange}
          />

          <CustomDatePicker
            error={!!errors.date}
            name="date"
            value={data.date}
            label="Received At"
            showTodayButton={true}
            handleDateChange={this.onChange}
          />
        </Form>
      </Container>
    );
  }
}

const component = withStyles(styles, { withTheme: true })(AddNew);

export default withRouter(component);
