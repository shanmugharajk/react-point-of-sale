import React, { useState, ChangeEvent } from "react";
import { Button } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router";
import { makeStyles } from "@material-ui/styles";
import AsyncDataGrid from "../../../components/controls/datagrid/AysncDataGrid";
import productsService from "../productsService";
import CircularLoader from "../../../components/controls/loader/CircularLoader";
import YesNo from "../../../components/controls/dialog/YesNo";
import Searchbox from "../../../components/controls/searchbox/Searchbox";
import AutoCloseMessage from "../../../components/controls/messages/AutoCloseMessage";
import styles from "./productTab.style";

interface IProps extends RouteComponentProps<{}> {}

const productColumns = [
  { headerName: "ID", actualName: "id" },
  { headerName: "Name", actualName: "name" },
  { headerName: "Description", actualName: "description" },
  { headerName: "Cost price", actualName: "cost_price" },
  { headerName: "Selling price", actualName: "selling_price" },
  { headerName: "Type", actualName: "product_type_id" }
];

interface IState {
  showMessage: boolean;
  isError: boolean;
  message: string;
  itemToDelete: string;
  searchText: string;
  isLoading: boolean;
  showConfirmDeleteDialog: boolean;
  doSearch: boolean;
}

const initialState: IState = {
  showMessage: true,
  isError: false,
  message: "",
  searchText: "",
  itemToDelete: "",
  isLoading: false,
  showConfirmDeleteDialog: false,
  doSearch: false
};

const ProductTab = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [state, setState] = useState<IState>(initialState);

  const onListClick = () => {
    setState({ ...state, searchText: "", showMessage: false });
  };

  const onSearchSubmit = (value: any) => {
    setState({ ...state, searchText: value });
  };

  const onCreateNewClick = () => {
    props.history.push("products/new");
  };

  const onEdit = (row: any) => {
    props.history.push(`products/edit/${row.id}`);
  };

  const onDelete = (itemToDelete: any) => {
    setState({
      ...state,
      showConfirmDeleteDialog: true,
      itemToDelete: itemToDelete.id
    });
  };

  const showMessage = (message: string, isError = false) => {
    setState({
      ...state,
      showMessage: true,
      isError,
      message,
      isLoading: false,
      showConfirmDeleteDialog: false
    });
  };

  const onConfirmDeleteClick = async () => {
    const { itemToDelete: id } = state;

    try {
      setState({ ...state, isLoading: true });

      const res = await productsService.products.services.delete(id);

      if (res.status === 204) {
        showMessage("Deleted successfully.");
      } else {
        throw new Error(
          `Couldn't delete the record. The status code is ${res.status}`
        );
      }
    } catch (error) {
      showMessage(error.message, true);
    }
  };

  const onCancelConfirmDeleteClick = () => {
    setState({ ...state, showConfirmDeleteDialog: false });
  };

  const onMessageCloseClick = () => {
    setState({ ...state, showMessage: false });
  };

  const getApiUrl = (pageNo?: number, pageSize?: number) => {
    const { searchText, doSearch } = state;

    if (!searchText || searchText.length === 0) {
      return productsService.products.urls.fetchByPages(pageNo, pageSize);
    }

    return productsService.products.urls.searchByIdAndGetByPages(
      searchText,
      pageNo,
      pageSize
    );
  };

  return (
    <div className={classes.wrapper}>
      <CircularLoader isLoading={state.isLoading} />
      <YesNo
        open={state.showConfirmDeleteDialog}
        message="Are you sure wan't to delete the selected item"
        onOk={onConfirmDeleteClick}
        onCancel={onCancelConfirmDeleteClick}
      />
      <div>
        <Button
          className={classes.button}
          variant="contained"
          color="default"
          size="small"
          onClick={onListClick}
        >
          List
        </Button>

        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          size="small"
          onClick={onCreateNewClick}
        >
          Create New
        </Button>
        <Searchbox onSubmit={onSearchSubmit} />
      </div>

      <AutoCloseMessage
        style={{ width: "98%" }}
        title="Message"
        message={state.message}
        show={!!state.message}
        isError={state.isError}
        onCloseClick={onMessageCloseClick}
        autoClose={!state.isError}
      />

      <div className={classes.wrapper}>
        <AsyncDataGrid
          columns={productColumns}
          actions={["edit", "del"]}
          fetchUrl={getApiUrl}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default withRouter(ProductTab);
