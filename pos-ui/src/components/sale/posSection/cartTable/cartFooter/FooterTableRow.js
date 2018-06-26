import React from "react";
import { TableRow } from "material-ui";
import { withStyles } from "material-ui/styles";

const styles = theme => ({
  footerRow: {
    backgroundColor: theme.palette.background.default
  }
});

const FooterTableRow = ({ classes, children, ...rest }) => (
  <TableRow className={classes.footerRow} {...rest}>
    {children !== undefined ? children : null}
  </TableRow>
);

export default withStyles(styles)(FooterTableRow);
