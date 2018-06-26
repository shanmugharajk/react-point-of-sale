import { IMessage } from "../dtos/messages";

export const TRANSACTION_ID_NOT_FOUND: IMessage = {
  code: "TRANSACTION_ID_NOT_FOUND",
  message: "invalid transaction id is sent"
};

export const NO_DATA_FOUND: IMessage = {
  code: "NO_DATA_FOUND",
  message: "No data found for this credit sale transaction."
};

export const ADDED_TO_CART: IMessage = {
  code: "ADDED_TO_CART",
  message: "Added to the cart successfully."
};

export const INVALID_PRICE: IMessage = {
  code: "INVALID_PRICE",
  message: "There is an error in the pricing total."
};

export const SALE_COMPLETED_SUCCESS: IMessage = {
  code: "SALE_COMPLETED_SUCCESS",
  message: "Sale completed successfully."
};

export const CART_EMPTIED: IMessage = {
  code: "CART_EMPTIED",
  message: "All cart items has been removed from the current transaction."
};

export const SALE_DELETED: IMessage = {
  code: "SALE_DELETED",
  message:
    "Sale associated with the transaction id has been deleted successfully."
};

export const INVALID_CUSTOMER: IMessage = {
  code: "INVALID_CUSTOMER",
  message: "Invalid customer details has been passed."
};

export const BALANCE_MISMATCH: IMessage = {
  code: "BALANCE_MISMATCH",
  message:
    "Ther is a balance mismatch happened. So couldn't finish this sale. Contact admin."
};
