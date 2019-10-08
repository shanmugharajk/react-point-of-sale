import React from "react";
import CustomTableCell from "../controls/CustomTableCell";

const NoItemsTableCell = () => (
  <CustomTableCell colSpan={6} style={{ padding: 20, textAlign: "center" }}>
    <strong>No items in the cart</strong>
  </CustomTableCell>
);

export default NoItemsTableCell;
