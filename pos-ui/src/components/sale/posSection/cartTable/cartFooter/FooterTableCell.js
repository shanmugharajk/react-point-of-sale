import React from "react";
import { withStyles } from "material-ui/styles";
import CustomTableCell from "../controls/CustomTableCell";

const styles = () => ({
  footerTableCell: {
    fontSize: "13px",
    // padding: "5px",
    fontWeight: "bold",
    color: "black",
    borderBottom: "none"
  }
});

const FooterTableCell = ({ classes, children, ...rest }) => (
  <CustomTableCell className={classes.footerTableCell} {...rest}>
    {children !== undefined ? children : null}
  </CustomTableCell>
);

export default withStyles(styles)(FooterTableCell);
