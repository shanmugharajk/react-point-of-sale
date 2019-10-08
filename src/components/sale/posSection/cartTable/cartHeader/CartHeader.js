import React from "react";
import { TableRow, TableHead } from "material-ui";
import CustomTableCell from "../controls/CustomTableCell";
import DeleteButton from "../controls/DeleteButton";

const CartHeader = ({ isCartEmpty, onDeleteAll }) => (
  <TableHead>
    <TableRow>
      <CustomTableCell style={{ width: 150, textAlign: "center" }}>
        Product
      </CustomTableCell>
      <CustomTableCell numeric>Price</CustomTableCell>
      <CustomTableCell numeric>Qty</CustomTableCell>
      <CustomTableCell numeric>Total</CustomTableCell>
      <CustomTableCell numeric style={{ width: 30, paddingRight: "5px" }}>
        {!isCartEmpty && <DeleteButton onDelete={onDeleteAll} />}
      </CustomTableCell>
    </TableRow>
  </TableHead>
);

export default CartHeader;
