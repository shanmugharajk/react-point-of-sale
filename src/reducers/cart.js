import currency from "currency.js";
import {
  ADD_ITEM_TO_CART,
  REMOVE_ITEM_FROM_CART,
  UPDATE_CART_ITEM,
  EMPTY_CART,
  UPDATE_DISCOUNT_ON_TOTAL,
  UPDATE_DISCOUNT_ON_ITEMS,
  UPDATE_TAX
} from "../types";

const initialState = {
  items: {},
  summary: {
    noOfItems: 0,
    noOfInividualItems: 0,
    tax: "0",
    taxAmount: "0.00",
    discountOnTotal: "0.00",
    discountOnItems: "0.00",
    total: "0.00", // With discount on items
    netTotal: "0.00" // Net - (tax + discount on total)
  }
};

const cloneObj = state => {
  const clone = {
    items: {},
    summary: {}
  };

  Object.assign(clone.items, state.items);
  Object.assign(clone.summary, state.summary);

  return clone;
};

const setCartItem = (state, item) => {
  // eslint-disable-next-line no-param-reassign
  state.items[item.id] = {};

  const newItem = state.items[item.id];
  newItem.id = item.id;
  newItem.name = item.name;
  newItem.qty = item.qty;
  newItem.price = currency(item.price).value;
  newItem.discount = currency(item.discount).value;
  newItem.discountTotal = currency(item.discount).multiply(item.qty).value;

  // This will be the price shown in the cart gridview.
  newItem.sellingPrice = currency(item.price).subtract(newItem.discount).value;

  // This is the total price on each item in cart gridview.
  newItem.totalPrice = currency(newItem.sellingPrice).multiply(item.qty).value;
};

const updateCartItem = (oldState, item) => {
  const state = cloneObj(oldState);
  setCartItem(state, item);

  // Subtract the old stuff from state to nullify.
  const { summary } = state;
  const oldItem = oldState.items[item.id];
  const newItem = state.items[item.id];

  summary.noOfInividualItems =
    summary.noOfInividualItems + newItem.qty - oldItem.qty;

  summary.discountOnItems = currency(summary.discountOnItems)
    .add(newItem.discountTotal)
    .subtract(oldItem.discountTotal).value;

  summary.total = currency(summary.total)
    .add(newItem.totalPrice)
    .subtract(oldItem.totalPrice).value;

  const totalAfterDiscountOnTotal = currency(summary.total).subtract(
    summary.discountOnTotal
  );

  summary.taxAmount = totalAfterDiscountOnTotal.multiply(
    summary.tax * 0.01
  ).value;

  summary.netTotal = totalAfterDiscountOnTotal.subtract(
    summary.taxAmount
  ).value;

  return state;
};

const addItemToCart = (oldState, item) => {
  const state = cloneObj(oldState);

  setCartItem(state, item);

  // setCartItem adds the new item to the state. So the assignment below holds the new added item.
  const newItem = state.items[item.id];

  // Summary updates
  const { summary } = state;

  summary.noOfItems++;
  summary.noOfInividualItems += newItem.qty;

  summary.discountOnItems = currency(summary.discountOnItems).add(
    newItem.discountTotal
  ).value;

  // This is the total price after applying discount on items.
  summary.total = currency(summary.total).add(newItem.totalPrice).value;

  const totalAfterDiscountOnTotal = currency(summary.total).subtract(
    summary.discountOnTotal
  );

  summary.taxAmount = totalAfterDiscountOnTotal.multiply(
    summary.tax * 0.01
  ).value;

  summary.netTotal = totalAfterDiscountOnTotal.subtract(
    summary.taxAmount
  ).value;

  return state;
};

const removeItemFromCart = (oldState, item) => {
  const state = cloneObj(oldState);
  delete state.items[item.id];

  const isCartEmpty = state.items.length === 0;

  if (isCartEmpty) {
    return initialState;
  }

  const { summary } = state;

  summary.noOfItems--;
  summary.noOfInividualItems -= item.qty;
  summary.discountOnItems = currency(summary.discountOnItems).subtract(
    item.discountTotal
  ).value;
  summary.total = currency(summary.total).subtract(item.totalPrice).value;

  const totalAfterDiscountOnTotal = currency(summary.total).subtract(
    summary.discountOnTotal
  );

  summary.taxAmount = totalAfterDiscountOnTotal.multiply(
    summary.tax * 0.01
  ).value;

  summary.netTotal = totalAfterDiscountOnTotal.subtract(
    summary.taxAmount
  ).value;

  return state;
};

const updateDiscountOnItems = (oldState, discount) => {
  const state = cloneObj(oldState);

  const { items } = state;
  const keys = Object.keys(items);

  for (let idx = 0; idx < keys.length; idx++) {
    const tmp = items[keys[idx]];

    tmp.discount = currency(discount).value;
    tmp.discountTotal = currency(discount).multiply(tmp.qty).value;

    tmp.sellingPrice = currency(tmp.price).subtract(tmp.discount).value;

    tmp.totalPrice = currency(tmp.sellingPrice).multiply(tmp.qty).value;
  }

  const { summary } = state;
  const oldDiscountOnItems = summary.discountOnItems;

  summary.discountOnItems = currency(discount).multiply(
    summary.noOfInividualItems
  ).value;

  summary.total = currency(summary.total)
    .add(oldDiscountOnItems)
    .subtract(summary.discountOnItems).value;

  const totalAfterDiscountOnTotal = currency(summary.total).subtract(
    summary.discountOnTotal
  );

  summary.taxAmount = totalAfterDiscountOnTotal.multiply(
    summary.tax * 0.01
  ).value;

  summary.netTotal = totalAfterDiscountOnTotal.subtract(
    summary.taxAmount
  ).value;

  return state;
};

const updateDiscountOnTotal = (oldState, discount) => {
  const state = cloneObj(oldState);

  const { summary } = state;

  summary.discountOnTotal = currency(discount).value;

  const totalAfterDiscountOnTotal = currency(summary.total).subtract(
    summary.discountOnTotal
  );

  summary.taxAmount = totalAfterDiscountOnTotal.multiply(
    summary.tax * 0.01
  ).value;

  summary.netTotal = totalAfterDiscountOnTotal.subtract(
    summary.taxAmount
  ).value;

  return state;
};

const updateTax = (oldState, tax) => {
  const state = cloneObj(oldState);

  const { summary } = state;

  const totalAfterDiscountOnTotal = currency(summary.total).subtract(
    summary.discountOnTotal
  );

  summary.tax = tax;

  summary.taxAmount = totalAfterDiscountOnTotal.multiply(
    summary.tax * 0.01
  ).value;

  summary.netTotal = totalAfterDiscountOnTotal.subtract(
    summary.taxAmount
  ).value;

  return state;
};

export default function cart(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_ITEM_TO_CART:
      return addItemToCart(state, action.data);

    case UPDATE_CART_ITEM:
      return updateCartItem(state, action.data);

    case REMOVE_ITEM_FROM_CART:
      return removeItemFromCart(state, action.data);

    case UPDATE_DISCOUNT_ON_ITEMS:
      return updateDiscountOnItems(state, action.data);

    case UPDATE_DISCOUNT_ON_TOTAL:
      return updateDiscountOnTotal(state, action.data);

    case UPDATE_TAX:
      return updateTax(state, action.data);

    case EMPTY_CART:
      return initialState;

    default:
      return state;
  }
}
