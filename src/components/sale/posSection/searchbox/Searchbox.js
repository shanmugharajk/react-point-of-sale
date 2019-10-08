import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Message from "../../../controls/Message";
import api from "../../../../api";
import { sleep } from "../../../../utils";
import AutoSuggestWithApiDatasource from "../../../controls/autoSuggest/AutoSuggestWithApiDatasource";
import { addItemToCart, updateCartItem } from "../../../../actions/cart";

class SearchBox extends Component {
  state = {
    showMessage: false,
    searchText: "",
    products: []
  };

  onChange = async e => {
    const searchText = e.target.value;

    if (!searchText || searchText.length < 3) {
      this.setState({ products: [], searchText });
      return;
    }

    this.setState({ searchText });

    try {
      const res = await api.product.searchByIdAndGetByPages(searchText);

      if (this.isExactMatch(searchText, res.data)) {
        await sleep(300);
        this.onSelected(res.data[0]);
      } else {
        this.setState({ products: res.data });
      }
    } catch (error) {
      console.log(error);

      this.setState({ showMessage: true });
    }
  };

  isExactMatch = (searchText, apiResults) => {
    if (apiResults.length === 0 || apiResults.length > 1) {
      return false;
    }
    const i = apiResults[0];
    return i.id === searchText || i.name === searchText;
  };

  onSelected = selectedItem => {
    this.setState({ searchText: "" });
    this.updateCart(selectedItem);
  };

  updateCart = item => {
    const { cart } = this.props;
    const existingItem = cart[item.id];

    if (existingItem) {
      const obj = this.constructCartObjForUpdate(existingItem);
      this.props.updateCartItem(obj);
    } else {
      const obj = this.constructCartObjForAddNew(item);
      this.props.addItemToCart(obj);
    }
  };

  constructCartObjForUpdate = obj => {
    const clone = {};
    Object.assign(clone, obj);
    clone.qty += 1;
    return clone;
  };

  constructCartObjForAddNew = obj => {
    const clone = {};
    Object.assign(clone, obj);

    clone.qty = 1;
    clone.price = clone.price;
    clone.discount = 0;
    clone.sellingPrice = clone.price;
    clone.totalPrice = clone.price;

    return clone;
  };

  onMessageCloseClick = () => {
    this.setState({ showMessage: false });
  };

  handleKeyDown = event => {
    if (event.key === "F11") {
      console.log(event.key);
    }
  };

  render() {
    const { products, searchText, showMessage } = this.state;

    return (
      <Fragment>
        <Message
          style={{ width: 430 }}
          title="Message"
          message="Something went wrong. Please try again later"
          show={showMessage}
          isError={true}
          onCloseClick={this.onMessageCloseClick}
        />
        <AutoSuggestWithApiDatasource
          searchText={searchText}
          width="450px"
          onKeyDown={this.handleKeyDown}
          onLeave={this.onLeave}
          onChange={this.onChange}
          onSelected={this.onSelected}
          datasource={products}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = ({ cart }) => ({
  cart: cart.items
});

export default connect(
  mapStateToProps,
  { updateCartItem, addItemToCart }
)(SearchBox);
