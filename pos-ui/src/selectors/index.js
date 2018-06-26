import { createSelector } from "reselect";

const getProductTypeSelector = () =>
  createSelector(
    state => state.productType,
    productType => {
      if (productType.list) {
        return productType;
      }
      return {
        list: [],
        pagination: {},
        meta: {}
      };
    }
  );

const getProductTypeDataForDropdownSelector = () =>
  createSelector(
    state => state.productType,
    productType => {
      if (productType.list) {
        return productType;
      }
      return {
        list: [],
        pagination: {},
        meta: {}
      };
    }
  );

const getCartItemsArraySelector = createSelector(
  state => state.cart.items,
  cart => {
    const keys = Object.keys(cart);
    const cartArray = [];
    for (let i = 0; i < keys.length; i++) {
      cartArray.push(cart[keys[i]]);
    }

    return cartArray;
  }
);

const getTotalSelector = createSelector(
  state => state.cart,
  cart => {
    const keys = Object.keys(cart);
    const total = {
      qty: 0,
      price: 0
    };

    for (let i = 0; i < keys.length; i++) {
      total.qty += cart[keys[i]].qty;
      total.price += cart[keys[i]].totalPrice;
    }

    return total;
  }
);

export {
  getProductTypeSelector,
  getProductTypeDataForDropdownSelector,
  getCartItemsArraySelector,
  getTotalSelector
};
