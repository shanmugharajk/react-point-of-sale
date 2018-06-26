import React, { Component } from "react";
import * as equal from "fast-deep-equal";
import { withRouter } from "react-router";
import Container from "../controls/Container";
import Form from "../controls/Form";
import CustomTextField from "../controls/textfields/CustomTextField";
import { isValueExists } from "../../utils";
import api from "../../api";
import Message from "../controls/Message";
import Prompt from "../controls/dialog/Prompt";
import CircularLoader from "../controls/loader/CircularLoader";

class AddNewExpenseType extends Component {
  initialData = {
    id: "",
    description: ""
  };

  state = {
    data: this.initialData,
    showMessage: false,
    errors: {},
    showMessageDialog: false,
    isLoading: false,
    isEdit: false
  };

  async componentDidMount() {
    try {
      const { id } = this.props.match.params;

      if (!id) {
        return;
      }

      this.setState({ isLoading: true });

      const stateToUpdate = {};
      const res = await api.expenseType.fetchById(id);

      stateToUpdate.data = res.data;
      stateToUpdate.isLoading = false;
      stateToUpdate.isEdit = true;

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

    const errors = isValueExists(this.state.data, ["description"]);

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    try {
      if (this.state.isEdit === true) {
        await this.update();
      } else {
        await this.createNew();
      }
    } catch (error) {
      this.showMessage(error.message, true);
    }
  };

  createNew = async () => {
    const res = await api.expenseType.createNew(this.state.data);

    if (res.status === 200) {
      this.showMessage("Saved successfully");
      this.clearForm();
    } else {
      throw new Error(
        `Unable to create the record. The status code is ${res.status}`
      );
    }
  };

  update = async () => {
    const res = await api.expenseType.update(
      this.props.match.params.id,
      this.state.data
    );

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

  showMessage = (message, isError = false) => {
    this.setState({
      showMessage: true,
      message,
      isError,
      isLoading: false
    });
  };

  onMessageDialogCloseClick = () => {
    this.setState({ showMessageDialog: false });
    this.props.history.goBack();
  };

  render() {
    const {
      data,
      errors,
      showMessage,
      isError,
      message,
      showMessageDialog,
      isLoading,
      isEdit
    } = this.state;

    return (
      <Container title={isEdit ? "Edit expense type" : "New expense type"}>
        <Message
          title="Message"
          message={message}
          show={showMessage}
          isError={isError}
          autoClose={!isError}
          onCloseClick={this.onMessageCloseClick}
        />

        <Prompt
          message="The expense type you entered was saved successfully."
          open={showMessageDialog}
          handleClose={this.onMessageDialogCloseClick}
        />
        <CircularLoader isLoading={isLoading} />

        <Form
          id="expenseType"
          onSubmit={this.onSubmit}
          onCancel={this.onCancelClick}
        >
          <CustomTextField
            inputRef={input => {
              this.idRef = input;
            }}
            error={!!errors.id}
            name="id"
            value={data.id}
            label="Expense type Id"
            helperText="This should be unique"
            onChange={this.onChange}
            disabled={isEdit}
          />
          <br />

          <CustomTextField
            name="description"
            value={data.description}
            label="Description"
            onChange={this.onChange}
          />
        </Form>
      </Container>
    );
  }
}

export default withRouter(AddNewExpenseType);
