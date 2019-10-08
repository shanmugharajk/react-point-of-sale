import React from "react";
import { withStyles } from "material-ui/styles";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import { TableCell } from "material-ui/Table";
import TablePaginationActions from "./TablePaginationActions";

export const styles = theme => ({
  root: {
    fontSize: theme.typography.pxToRem(12),
    // Increase the specificity to override TableCell.
    "&:last-child": {
      padding: 0
    }
  },
  toolbar: {
    height: 56,
    minHeight: 56,
    paddingRight: 2
  },
  spacer: {
    flex: "1 1 100%"
  },
  caption: {
    flexShrink: 0
  },
  input: {
    fontSize: "inherit",
    flexShrink: 0
  },
  selectRoot: {
    marginRight: theme.spacing.unit * 4,
    marginLeft: theme.spacing.unit,
    color: theme.palette.text.secondary
  },
  select: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit * 2
  },
  selectIcon: {
    top: 1
  },
  actions: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

class CustomTablePagination extends React.Component {
  render() {
    const {
      classes,
      colSpan: colSpanProp,
      component: Component,
      count,
      labelDisplayedRows,
      page,
      rowsPerPage,
      paginationActions
    } = this.props;

    let colSpan;

    if (Component === TableCell || Component === "td") {
      colSpan = colSpanProp || 1000; // col-span over everything
    }

    const lblFromText = count === 0 ? 0 : (page - 1) * rowsPerPage + 1;
    const lblToText = Math.min(count, page * rowsPerPage);

    return (
      <Component className={classes.root} colSpan={colSpan}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.spacer} />
          <Typography variant="caption" className={classes.caption}>
            {labelDisplayedRows({
              from: lblFromText,
              to: lblToText,
              count,
              page
            })}
          </Typography>
          <TablePaginationActions
            count={count}
            page={page} // TODO indexing difference. See comment on LNO : 57
            rowsPerPage={rowsPerPage}
            {...paginationActions}
          />
        </Toolbar>
      </Component>
    );
  }
}

CustomTablePagination.defaultProps = {
  component: TableCell,
  labelDisplayedRows: ({ from, to, count }) => `${from}-${to} of ${count}`,
  labelRowsPerPage: "Rows per page:"
};

export default withStyles(styles)(CustomTablePagination);
