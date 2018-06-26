import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import styles from "./styles";
import PosSection from "./posSection/PosSection";
import GridItem from "./displaySection/GridItem";

class Sale extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.flexContainer}>
        {/* Left side carts grid and barcode/search text box  */}
        <div className={classes.pos}>
          <PosSection />
        </div>

        {/* Right side products display grid */}
        <div className={classes.items}>
          <GridItem />
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Sale);
