import React from "react";
import { TableBody, TableRow } from "material-ui";
import CustomTableCell from "../controls/CustomTableCell";
import LightButton from "../controls/LightButton";
import DeleteButton from "../controls/DeleteButton";
import CartBodyNoItems from "./CartBodyNoItems";

const CartBody = ({ cartArray, onDeleteCartItem, onProductItemSelect }) => {
  if (cartArray.length === 0) {
    return <CartBodyNoItems />;
  }

  return (
    <TableBody>
      {cartArray.map(n => (
        <TableRow key={n.id}>
          <CustomTableCell style={{ width: 150 }}>
            <LightButton text={n.name} onClick={() => onProductItemSelect(n)} />
          </CustomTableCell>
          <CustomTableCell numeric>{n.sellingPrice}</CustomTableCell>
          <CustomTableCell numeric>{n.qty}</CustomTableCell>
          <CustomTableCell numeric>{n.totalPrice}</CustomTableCell>
          <CustomTableCell numeric style={{ width: 30, paddingRight: "5px" }}>
            <DeleteButton onDelete={() => onDeleteCartItem(n)} />
          </CustomTableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default CartBody;
