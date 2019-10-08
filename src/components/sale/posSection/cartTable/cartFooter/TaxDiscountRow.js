/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, Fragment } from "react";
import FooterTableCell from "./FooterTableCell";
import FooterTableRow from "./FooterTableRow";
import LinkButton from "../controls/LinkButton";
import DiscountPopup from "./DiscountPopup";
import TaxPopup from "./TaxPopup";

class TaxDiscountRow extends Component {
  state = {
    showDiscount: false,
    showTax: false
  };

  toggleDiscount = () => {
    this.setState({ showDiscount: !this.state.showDiscount });
  };

  toggleTax = () => {
    this.setState({ showTax: !this.state.showTax });
  };

  render() {
    const { cartArray, summary } = this.props;

    const discountText = `${summary.discountOnItems} (${
      summary.discountOnTotal
    })`;
    const { taxAmount, tax } = summary;

    const { showDiscount, showTax } = this.state;

    return (
      <Fragment>
        <DiscountPopup
          summary={summary}
          cartArray={cartArray}
          close={this.toggleDiscount}
          open={showDiscount}
        />
        <TaxPopup tax={summary.tax} open={showTax} close={this.toggleTax} />
        <FooterTableRow>
          <FooterTableCell numeric style={{ width: "150px" }}>
            <LinkButton text="Discount" onClick={this.toggleDiscount} />
          </FooterTableCell>
          <FooterTableCell numeric>{discountText}</FooterTableCell>
          <FooterTableCell numeric />
          <FooterTableCell style={{ paddingLeft: "15px" }}>
            <LinkButton text={`Tax (${tax}%)`} onClick={this.toggleTax} />
          </FooterTableCell>
          <FooterTableCell numeric>{taxAmount}</FooterTableCell>
        </FooterTableRow>
      </Fragment>
    );
  }
}

export default TaxDiscountRow;
