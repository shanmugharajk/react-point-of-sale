import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/styles";
import {
  LinearProgress,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  Button,
  TableFooter
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Overlay from "../overlay/Overlay";
import CustomTableCell from "./CustomTableCell";
import styles from "./datagrid.style";
import useApi from "../../../hooks/useApi";
import Message from "../messages/Message";
import Pagination from "./Pagination";
import ErrorMessage from "../messages/ErrorMessage";

interface ICoulmn {
  headerName: string;
  actualName: string;
}

interface IProps {
  columns: Array<ICoulmn>;
  actions: Array<string>;
  pageSize?: number;
  fetchUrl: (pageNo?: number, pageSize?: number) => string;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onSelect?: (row: any) => void;
  transformers?: any;
}

const LoadingIndicator = () => {
  return (
    <>
      <LinearProgress value={24} style={{ height: 1 }} />
      <Overlay />
    </>
  );
};

const renderCellValue = (key: any, val: any, props: IProps) => {
  if (props.transformers && props.transformers[key]) {
    return props.transformers[key](val);
  }
  return val;
};

const renderRow = (row: any, props: IProps, classes: any) => {
  const keys = Object.keys(props.columns);

  return keys.map((idx: any) => {
    const colName = props.columns[idx].actualName;

    if (props.actions.includes("sel") && idx === 0) {
      return (
        // eslint-disable-next-line react/no-array-index-key
        <TableCell key={`${keys[idx]}${idx}`}>
          <Button color="primary" onClick={() => (props as any).onSelect(row)}>
            {renderCellValue(colName, row[colName], props)}
          </Button>
        </TableCell>
      );
    }

    if (keys[idx] === "price") {
      return (
        // eslint-disable-next-line react/no-array-index-key
        <TableCell key={`${keys[idx]}${idx}`}>
          <input
            type="text"
            value={renderCellValue(colName, row[colName], props)}
            className={classNames(classes.gridEdit, classes.gridNumberEdit)}
          />
        </TableCell>
      );
    }

    return (
      // eslint-disable-next-line react/no-array-index-key
      <TableCell key={`${keys[idx]}${idx}`}>
        {renderCellValue(colName, row[colName], props)}
      </TableCell>
    );
  });
};

const renderActions = (row: any, props: IProps) => {
  if (props.actions.length === 0) {
    return null;
  }

  return (
    <TableCell>
      {props.actions.includes("edit") && (
        <IconButton onClick={() => (props as any).onEdit(row)}>
          <EditIcon />
        </IconButton>
      )}
      {props.actions.includes("del") && (
        <IconButton onClick={() => (props as any).onDelete(row)}>
          <DeleteIcon />
        </IconButton>
      )}
    </TableCell>
  );
};

const renderHeader = (
  classes: any,
  headers: Array<ICoulmn>,
  showActions: boolean
) => (
  <TableHead className={classes.head}>
    <TableRow>
      {headers.map(({ headerName }) => (
        <CustomTableCell key={headerName}>{headerName}</CustomTableCell>
      ))}
      {showActions && <CustomTableCell>Actions</CustomTableCell>}
    </TableRow>
  </TableHead>
);

const renderBody = (resultset: any, props: IProps, classes: any) => {
  if (!resultset) {
    return null;
  }

  const { data } = resultset;

  return (
    <TableBody>
      {(data as Array<any>).map((row, idx) => {
        const keys = Object.keys(row);
        return (
          // eslint-disable-next-line react/no-array-index-key
          <TableRow key={`${keys[0]}${idx}`}>
            {renderRow(row, props, classes)}
            {renderActions(row, props)}
          </TableRow>
        );
      })}
    </TableBody>
  );
};

const renderNoRecordsMessage = () => (
  <Message
    style={{ width: "100%", marginLeft: 0 }}
    title="Info"
    message="No records found"
  />
);

const renderFooter = (resultSet: any, props: IProps, state: any) => {
  if (!resultSet) {
    return null;
  }

  const { columns, pageSize = 10 } = props;
  const { data, pagination_info: paginationInfo } = resultSet;

  const hasRecords =
    resultSet && (data.length > 0 || paginationInfo.total_pages > 1);

  if (!hasRecords) {
    return null;
  }

  const { pageNo, setPageNo } = state;

  const paginationActions: any = {};
  paginationActions.onFirst = () => setPageNo(1);
  paginationActions.onNext = () => setPageNo(pageNo + 1);
  paginationActions.onPrev = () => setPageNo(pageNo - 1);
  paginationActions.onLast = () => setPageNo(paginationInfo.total_pages);

  return (
    <TableFooter>
      <TableRow>
        <Pagination
          colSpan={columns.length + 1}
          count={paginationInfo.total_rows}
          rowsPerPage={pageSize}
          page={paginationInfo.page_number}
          paginationActions={paginationActions}
        />
      </TableRow>
    </TableFooter>
  );
};

const AsyncDataGrid = (props: IProps) => {
  const { fetchUrl } = props;

  const [pageNo, setPageNo] = useState(1);
  const iurl = fetchUrl(pageNo);
  const [url, setUrl] = useState(iurl);
  const [loading, resultSet, error] = useApi(url);

  useEffect(() => {
    setUrl(iurl);
  }, [pageNo, iurl]);

  const hasRecords = resultSet && resultSet.data.length > 0;
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  if (error) {
    return (
      <ErrorMessage show={error} message="Got an error in fetching records" />
    );
  }

  return (
    <div className={classes.wrapper}>
      {loading && <LoadingIndicator />}
      <Paper className={classes.root}>
        <Table className={classes.table}>
          {renderHeader(classes, props.columns, props.actions.length > 0)}
          {renderBody(resultSet, props, classes)}
          {renderFooter(resultSet, props, { pageNo, setPageNo })}
        </Table>
      </Paper>
      {!hasRecords && loading === false && renderNoRecordsMessage()}
    </div>
  );
};

AsyncDataGrid.defaultProps = {
  pageSize: 10,
  onEdit: () => {},
  onDelete: () => {},
  onSelect: () => {},
  transformers: null
};

export default AsyncDataGrid;
