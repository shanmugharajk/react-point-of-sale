import {
  ADD_ITEM_TO_CART,
  REMOVE_ITEM_FROM_CART,
  UPDATE_CART_ITEM,
  EMPTY_CART,
  UPDATE_DISCOUNT_ON_TOTAL,
  UPDATE_DISCOUNT_ON_ITEMS,
  UPDATE_TAX
} from "../types";

/*
discount : "0.00"
price : "12.00"
sellingPrice : "12.00"
totalPrice : "12.00"
*/

// eslint-disable-next-line
export const emptyCart = () => ({
  type: EMPTY_CART
});

export const addItemToCart = data => ({
  type: ADD_ITEM_TO_CART,
  data
});

export const updateCartItem = data => ({
  type: UPDATE_CART_ITEM,
  data
});

export const removeItemFromCart = data => ({
  type: REMOVE_ITEM_FROM_CART,
  data
});

export const updateDiscountOnItems = data => ({
  type: UPDATE_DISCOUNT_ON_ITEMS,
  data
});

export const updateDiscountOnTotal = data => ({
  type: UPDATE_DISCOUNT_ON_TOTAL,
  data
});

export const updateTax = data => ({
  type: UPDATE_TAX,
  data
});
