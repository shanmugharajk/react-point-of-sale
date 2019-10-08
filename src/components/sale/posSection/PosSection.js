import React, { Component, Fragment } from "react";
import CartTable from "./cartTable";
import SearchBox from "./searchbox";
import Footer from "./footer";

class PosSection extends Component {
  state = {};

  render() {
    return (
      <Fragment>
        <SearchBox />
        <CartTable />
        <Footer />
      </Fragment>
    );
  }
}

export default PosSection;
