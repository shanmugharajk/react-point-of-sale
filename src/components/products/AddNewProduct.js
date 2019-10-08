import React, { Component } from "react";
import * as equal from "fast-deep-equal";
import { withRouter } from "react-router";
import { withStyles } from "material-ui/styles";
import Container from "../controls/Container";
import Form from "../controls/Form";
import CustomTextField from "../controls/textfields/CustomTextField";
import Dropdown from "../controls/dropdown/Dropdown";
import CircularLoader from "../controls/loader/CircularLoader";
import api from "../../api";
import NumberTextField from "../controls/textfields/NumberTextField";
import { isValueExists } from "../../utils";
import Message from "../controls/Message";
import Prompt from "../controls/dialog/Prompt";

// eslint-disable-next-line
const styles = theme => ({
  form: {
    marginLeft: 20
  },
  wrapper: {
    position: "relative"
  }
});

class AddNewProduct extends Component {
  initialData = {
    id: "",
    name: "",
    description: "",
    costPrice: "",
    sellingPrice: "",
    productTypeId: ""
  };

  state = {
    data: this.initialData,
    errors: {},
    isLoading: false,
    productTypeIds: [],
    showMessage: false,
    isEdit: false,
    showMessageDialog: false
  };

  constructor(props) {
    super(props);
    window.onbeforeunload = () => {
      sessionStorage.setItem("form", JSON.stringify(this.state.data));
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });

    try {
      const stateToUpdate = {};

      const res = await api.productType.fetchAll();
      const productTypeIds = res.data.map(d => ({
        value: d.id,
        label: d.id
      }));

      stateToUpdate.productTypeIds = productTypeIds;
      stateToUpdate.isLoading = false;

      const { id } = this.props.match.params;

      if (id) {
        const res2 = await api.product.fetchById(id);
        const productToEdit = res2.data;
        stateToUpdate.data = productToEdit;
        stateToUpdate.isEdit = true;
      }

      this.setState({ ...stateToUpdate });
    } catch (error) {
      this.showError(error);
    }
  }

  onChange = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value },
      errors: { ...this.state.errors, [e.target.name]: "" }
    });
  };

  onProductTypeDropdownChange = value => {
    const productTypeId = value === null ? "" : value;

    this.setState({
      data: { ...this.state.data, productTypeId },
      errors: { ...this.state.errors, productTypeId: "" }
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
      this.state.data.costPrice = Number(this.state.data.costPrice);
      this.state.data.sellingPrice = Number(this.state.data.sellingPrice);

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
    const res = await api.product.createNew(data);

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
    const res = await api.product.update(this.props.match.params.id, data);

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
      productTypeIds,
      showMessage,
      isError,
      message,
      isEdit,
      showMessageDialog
    } = this.state;

    return (
      <Container title={isEdit ? "Edit Product" : "New Product"}>
        <Prompt
          message="The product you entered was saved successfully."
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
          id="product"
          onSubmit={this.onSubmit}
          onCancel={this.onCancelClick}
          className={classes.form}
        >
          <CustomTextField
            inputRef={input => {
              this.idRef = input;
            }}
            error={!!errors.id}
            name="id"
            value={data.id}
            label="Product Id"
            helperText="This should be unique"
            onChange={this.onChange}
            disabled={isEdit}
          />

          <CustomTextField
            error={!!errors.name}
            name="name"
            value={data.name}
            label="Name"
            onChange={this.onChange}
          />

          <Dropdown
            name="productType"
            value={data.productTypeId}
            error={!!errors.productType}
            datasource={productTypeIds}
            onChange={this.onProductTypeDropdownChange}
            placeholder=""
            label="Product type"
          />

          <CustomTextField
            error={!!errors.description}
            name="description"
            value={data.description}
            label="Description"
            onChange={this.onChange}
          />

          <NumberTextField
            error={!!errors.costPrice}
            name="costPrice"
            value={data.costPrice}
            label="Cost price"
            onChange={this.onChange}
          />

          <NumberTextField
            error={!!errors.sellingPrice}
            name="sellingPrice"
            value={data.sellingPrice}
            label="Selling price"
            onChange={this.onChange}
          />
        </Form>
      </Container>
    );
  }
}

const component = withStyles(styles, { withTheme: true })(AddNewProduct);

export default withRouter(component);
