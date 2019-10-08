import { INIT_TRANSACTION, CANCEL_TRANSACTION } from "../types";

export default function transaction(state = {}, action = {}) {
  switch (action.type) {
    case INIT_TRANSACTION:
      return { ...state, id: action.data };

    case CANCEL_TRANSACTION:
      return {};

    default:
      return {};
  }
}
