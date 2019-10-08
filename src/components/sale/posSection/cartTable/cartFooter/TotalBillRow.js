import React from "react";
import { withStyles } from "material-ui/styles";
import FooterTableCell from "./FooterTableCell";
import FooterTableRow from "./FooterTableRow";

const styles = () => ({
  root: {
    backgroundColor: "#e5e5e5"
  }
});

const TotalBillRow = ({ classes, netTotal }) => (
  <FooterTableRow className={classes.root}>
    <FooterTableCell numeric style={{ width: "150px" }} />
    <FooterTableCell numeric />
    <FooterTableCell />
    <FooterTableCell style={{ paddingLeft: "15px" }}>
      Net bill amount
    </FooterTableCell>
    <FooterTableCell numeric>{netTotal}</FooterTableCell>
  </FooterTableRow>
);

export default withStyles(styles)(TotalBillRow);
