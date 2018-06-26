import React, { Component } from "react";
import { Table, TableBody } from "material-ui";
import TotalRow from "./TotalRow";
import TaxDiscountRow from "./TaxDiscountRow";
import TotalBillRow from "./TotalBillRow";

class CartFooter extends Component {
  state = {};

  render() {
    const { cartArray, summary } = this.props;

    if (summary.noOfItems === 0) {
      return null;
    }

    const totalQtyText = `${summary.noOfItems} (${summary.noOfInividualItems})`;
    const totalPrice = summary.total;
    const { netTotal } = summary;

    return (
      <Table style={{ marginTop: "50px" }}>
        <TableBody>
          <TotalRow totalQtyText={totalQtyText} totalPrice={totalPrice} />
          <TaxDiscountRow cartArray={cartArray} summary={summary} />
          <TotalBillRow netTotal={netTotal} />
        </TableBody>
      </Table>
    );
  }
}

export default CartFooter;
