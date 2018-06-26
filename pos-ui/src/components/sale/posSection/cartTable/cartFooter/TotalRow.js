import React from "react";
import FooterTableCell from "./FooterTableCell";
import FooterTableRow from "./FooterTableRow";

const TotalRow = ({ totalQtyText, totalPrice }) => (
  <FooterTableRow style={{ paddingTop: "20px" }}>
    <FooterTableCell numeric>Total Items</FooterTableCell>
    <FooterTableCell numeric>{totalQtyText}</FooterTableCell>
    <FooterTableCell numeric />
    <FooterTableCell style={{ paddingLeft: "15px" }}>
      Total{" "}
      <span style={{ fontWeight: "400", fontSize: "11px" }}>(discounted)</span>
    </FooterTableCell>
    <FooterTableCell numeric>{totalPrice}</FooterTableCell>
  </FooterTableRow>
);

export default TotalRow;
