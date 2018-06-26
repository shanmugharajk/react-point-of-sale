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

class AddNewExpense extends Component {
  initialData = {
    expenseTypeId: "",
    description: "",
    amount: "",
    spentAt: ""
  };

  state = {
    data: this.initialData,
    errors: {},
    isLoading: false,
    expenseTypeIds: [],
    showMessage: false,
    isEdit: false,
    showMessageDialog: false
  };

  async componentDidMount() {
    this.setState({ isLoading: true });

    try {
      const stateToUpdate = {};

      const res = await api.expenseType.fetchAll();
      const expenseTypeIds = res.data.map(d => ({
        value: d.id,
        label: d.id
      }));

      stateToUpdate.expenseTypeIds = expenseTypeIds;
      stateToUpdate.isLoading = false;

      const { id } = this.props.match.params;

      if (id) {
        const res2 = await api.expense.fetchById(id);
        const expenseToEdit = res2.data;
        stateToUpdate.data = expenseToEdit;
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

  onExpenseTypeDropdownChange = value => {
    const expenseTypeId = value === null ? "" : value;

    this.setState({
      data: { ...this.state.data, expenseTypeId },
      errors: { ...this.state.errors, expenseTypeId: "" }
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
      this.state.data.amount = Number(this.state.data.amount);

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
    const res = await api.expense.createNew(data);

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
    const res = await api.expense.update(this.props.match.params.id, data);

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
    const {
      data,
      errors,
      isLoading,
      expenseTypeIds,
      showMessage,
      isError,
      message,
      isEdit,
      showMessageDialog
    } = this.state;

    return (
      <Container title={isEdit ? "Edit Expense" : "New Expense"}>
        <Prompt
          message="The expense you entered was saved successfully."
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
          id="expense"
          onSubmit={this.onSubmit}
          onCancel={this.onCancelClick}
        >
          <CustomTextField
            inputRef={input => {
              this.idRef = input;
            }}
            error={!!errors.description}
            name="description"
            value={data.description}
            label="Expense description"
            onChange={this.onChange}
          />

          <Dropdown
            name="expenseType"
            value={data.expenseTypeId}
            error={!!errors.expenseType}
            datasource={expenseTypeIds}
            onChange={this.onExpenseTypeDropdownChange}
            placeholder=""
            label="Expense type"
          />

          <NumberTextField
            error={!!errors.amount}
            name="amount"
            value={data.amount}
            label="Amount"
            onChange={this.onChange}
          />

          <CustomDatePicker
            error={!!errors.spentAt}
            name="spentAt"
            label="Spent At"
            value={data.spentAt}
            showTodayButton={true}
            handleDateChange={this.onChange}
          />
        </Form>
      </Container>
    );
  }
}

const component = withStyles(styles, { withTheme: true })(AddNewExpense);

export default withRouter(component);
