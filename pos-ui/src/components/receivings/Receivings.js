import React, { Component } from "react";
import * as moment from "moment";
import Button from "material-ui/Button";
import { withRouter } from "react-router";
import { withStyles } from "material-ui/styles";
import Container from "../controls/Container";
import Searchbox from "../controls/Searchbox";
import Message from "../controls/Message";
import ApiAutoFetchDatagrid from "../controls/datagrid/ApiAutoFetchDatagrid";
import api from "../../api";
import CircularLoader from "../controls/loader/CircularLoader";
import YesNo from "../controls/dialog/YesNo";

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  },
  wrapper: {
    position: "relative",
    margin: "20px 5px 5px 5px"
  }
});

class Receivings extends Component {
  receivingsColumns = [
    "Order Id",
    "Product",
    "Vendor",
    "Qty",
    "Price",
    "Paid",
    "Date"
  ];

  state = {
    clearSearch: false,
    serachQuery: "",
    message: "",
    showMessage: false,
    isError: false,
    isLoading: false,
    showConfirmDeleteDialog: false
  };

  onListClick = () => {
    this.setState({ clearSearch: true, serachQuery: "", showMessage: false });
  };

  onSearchSubmit = async id => {
    this.setState({ clearSearch: false, serachQuery: id });
  };

  onCreateNewClick = () => {
    this.props.history.push("receivings/new");
  };

  onEdit = row => {
    this.props.history.push(`receivings/edit/${row.id}`);
  };

  onDelete = itemToDelete => {
    this.setState({ showConfirmDeleteDialog: true, itemToDelete });
  };

  onConfirmDeleteClick = async () => {
    const { id } = this.state.itemToDelete;

    try {
      this.setState({ isLoading: true });

      const res = await api.receiving.delete(id);

      if (res.status === 200) {
        this.showMessage("Deleted successfully.");
      } else {
        throw new Error(
          `Couldn't delete the record. The status code is ${res.status}`
        );
      }
    } catch (error) {
      this.showMessage(error.message, true);
    }
  };

  showMessage = (message, isError = false) => {
    this.setState({
      showMessage: true,
      isError,
      message,
      isLoading: false,
      showConfirmDeleteDialog: false
    });
  };

  onMessageCloseClick = () => {
    this.setState({ showMessage: false });
  };

  onCancelConfirmDeleteClick = () => {
    this.setState({ showConfirmDeleteDialog: false });
  };

  getApiPromise = () => {
    const { serachQuery } = this.state;

    if (serachQuery.length === 0) {
      return api.receiving.fetchByPages();
    }

    return api.receiving.searchByIdAndGetByPages(serachQuery);
  };

  render() {
    const { classes } = this.props;
    const {
      clearSearch,
      message,
      showMessage,
      isError,
      isLoading,
      showConfirmDeleteDialog
    } = this.state;

    return (
      <Container title="Receivings">
        <CircularLoader isLoading={isLoading} />
        <YesNo
          open={showConfirmDeleteDialog}
          message="Are you sure wan't to delete the selected item"
          onOk={this.onConfirmDeleteClick}
          onCancel={this.onCancelConfirmDeleteClick}
        />

        <div>
          <Button
            className={classes.button}
            variant="raised"
            color="default"
            size="small"
            onClick={this.onListClick}
          >
            List
          </Button>

          <Button
            className={classes.button}
            variant="raised"
            color="primary"
            size="small"
            onClick={this.onCreateNewClick}
          >
            Create New
          </Button>

          <Searchbox
            placeholder="Vendor ID"
            clear={clearSearch}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          />
        </div>

        <Message
          style={{ width: "98%" }}
          title="Message"
          message={message}
          show={showMessage}
          isError={isError}
          onCloseClick={this.onMessageCloseClick}
          autoClose={!isError}
        />
        <div className={classes.wrapper}>
          <ApiAutoFetchDatagrid
            datasourcePromise={this.getApiPromise}
            actions={["del", "edit", "sel"]}
            onEdit={this.onEdit}
            onDelete={this.onDelete}
            headers={this.receivingsColumns}
            transformers={{
              date: value => moment(value).format("DD-MM-YYYY")
            }}
          />
        </div>
      </Container>
    );
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Receivings));
