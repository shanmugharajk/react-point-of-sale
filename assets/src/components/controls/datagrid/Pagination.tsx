import React from "react";
import { makeStyles } from "@material-ui/styles";
import { TableCell, Toolbar, Typography } from "@material-ui/core";
import PaginationActions from "./PaginationActions";
import styles from "./pagination.style";

interface ILabelDisplayedRowsParams {
  from: string;
  to: string;
  count: number;
  page?: number;
}

interface IProps {
  count: number;
  colSpan: any;
  page: number;
  rowsPerPage: number;
  paginationActions: {
    onFirst: () => void;
    onPrev: () => void;
    onLast: () => void;
    onNext: () => void;
  };
  component?: any; // TODO: find the right type here for Component
  labelDisplayedRows?: (params: ILabelDisplayedRowsParams) => string;
  labelRowsPerPage?: string;
}

const Pagination = ({
  component: Component,
  colSpan: colSpanProp,
  count,
  page,
  rowsPerPage,
  paginationActions,
  labelDisplayedRows
}: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  let colSpan;

  if (Component === TableCell || (Component as any) === "td") {
    colSpan = colSpanProp || 1000; // col-span over everything
  }

  const lblFromText = count === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const lblToText = Math.min(count, page * rowsPerPage);

  const func = labelDisplayedRows as any;

  return (
    <Component className={classes.root} colSpan={colSpan}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.spacer} />
        <Typography variant="caption" className={classes.caption}>
          {/* TODO: How to overcome this? */}
          {func({ from: lblFromText, to: lblToText, count })}
        </Typography>
        <PaginationActions
          count={count}
          page={page} // TODO indexing difference. See comment on LNO : 57
          rowsPerPage={rowsPerPage}
          paginationActions={paginationActions}
        />
      </Toolbar>
    </Component>
  );
};

Pagination.defaultProps = {
  component: TableCell,
  labelDisplayedRows: ({ from, to, count }: ILabelDisplayedRowsParams) =>
    `${from}-${to} of ${count}`,
  labelRowsPerPage: "Rows per page:"
};

export default Pagination;
