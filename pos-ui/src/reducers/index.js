import { combineReducers } from "redux";
import { USER_LOGGED_OUT } from "../types";

import auth from "./auth";
import productType from "./productType";
import cart from "./cart";
import transaction from "./transaction";

const appReducer = combineReducers({
  auth,
  productType,
  cart,
  transaction
});

const rootReducer = (state, action) => {
  if (action.type === USER_LOGGED_OUT) {
    return {};
  }
  return appReducer(state, action);
};

export default rootReducer;
