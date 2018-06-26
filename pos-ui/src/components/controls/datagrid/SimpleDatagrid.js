import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import { LinearProgress } from "material-ui/Progress";
import IconButton from "material-ui/IconButton";
import DeleteIcon from "material-ui-icons/Delete";
import EditIcon from "material-ui-icons/Edit";
import Button from "material-ui/Button";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter
} from "material-ui/Table";
import Paper from "material-ui/Paper";
import CustomTablePagination from "./CustomTablePagination";
import CustomTableCell from "./CustomTableCell";
import Overlay from "../Overlay";
import Message from "../Message";

// eslint-disable-next-line
const styles = theme => ({
  root: {
    width: "100%",
    overflowX: "auto",
    flexShrink: 0
  },
  table: {
    minWidth: 700
  },
  head: {
    background: "#e0e0e0"
  },
  wrapper: {
    position: "relative"
  },
  overlay: {
    top: 0,
    position: "absolute",
    background: "#ffffffad",
    height: "100%",
    width: "100%",
    zIndex: 100
  }
});

class SimpleDatagrid extends Component {
  state = {
    currentPageData: [],
    currentPageNumber: 1
  };

  componentDidMount() {
    this.initialize(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  }

  initialize = props => {
    if (props.data.list.length === 0) {
      this.setState({ currentPageData: [] });
      return;
    }

    this.goToPage(1, props);

    const totalPages = Math.ceil(props.data.list.length / props.rowsPerPage);

    this.setState({ totalPages });
  };

  onFirst = () => {
    this.goToPage(1);
  };

  onLast = () => {
    this.goToPage(this.state.totalPages);
  };

  onNext = async () => {
    this.goToPage(this.state.currentPageNumber + 1);
  };

  onPrev = () => {
    this.goToPage(this.state.currentPageNumber - 1);
  };

  goToPage = (pageNum, props = this.props) => {
    const { data, rowsPerPage } = props;

    const startIdx = (pageNum - 1) * rowsPerPage;

    const lastIdx = Math.min(data.list.length, pageNum * rowsPerPage);
    const currentPageData = data.list.slice(startIdx, lastIdx);

    this.setState({ currentPageData, currentPageNumber: pageNum });
  };

  renderHeader = () => (
    <TableHead className={this.props.classes.head}>
      <TableRow>
        {this.props.headers.map(h => (
          <CustomTableCell key={h}>{h}</CustomTableCell>
        ))}
        {this.props.actions.length > 0 && (
          <CustomTableCell>Actions</CustomTableCell>
        )}
      </TableRow>
    </TableHead>
  );

  renderRow = row => {
    const keys = Object.keys(row);

    const renderValue = (key, val) => {
      if (this.props.transformers && this.props.transformers[key]) {
        return this.props.transformers[key](val);
      }
      return val;
    };

    return keys.map((k, idx) => {
      if (this.props.actions.includes("sel") && idx === 0) {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <TableCell key={`${keys[idx]}${idx}`}>
            <Button color="primary" onClick={() => this.props.onSelect(row)}>
              {renderValue(k, row[k])}
            </Button>
          </TableCell>
        );
      }

      return (
        // eslint-disable-next-line react/no-array-index-key
        <TableCell key={`${keys[idx]}${idx}`}>
          {renderValue(k, row[k])}
        </TableCell>
      );
    });
  };

  renderActions = row => {
    if (this.props.actions.length === 0) {
      return null;
    }

    return (
      <TableCell>
        {this.props.actions.includes("edit") && (
          <IconButton>
            <EditIcon onClick={() => this.props.onEdit(row)} />
          </IconButton>
        )}
        {this.props.actions.includes("del") && (
          <IconButton>
            <DeleteIcon onClick={() => this.props.onDelete(row)} />
          </IconButton>
        )}
      </TableCell>
    );
  };

  renderBody = () => {
    const { currentPageData } = this.state;

    return (
      <TableBody>
        {currentPageData.map((row, idx) => {
          const keys = Object.keys(row);
          return (
            // eslint-disable-next-line react/no-array-index-key
            <TableRow key={`${keys[0]}${idx}`}>
              {this.renderRow(row)}
              {this.renderActions(row)}
            </TableRow>
          );
        })}
      </TableBody>
    );
  };

  renderNoRecordsMessage = () => {
    const { isLoading } = this.props;

    return (
      <Message
        style={{ width: "100%", marginLeft: 0 }}
        title="Info"
        message="No records found"
        show={this.state.currentPageData.length === 0 && isLoading === false}
      />
    );
  };

  renderFooter = () => {
    const { data, rowsPerPage } = this.props;
    const { currentPageData, currentPageNumber } = this.state;

    const paginationActions = {};
    paginationActions.onFirst = this.onFirst;
    paginationActions.onNext = this.onNext;
    paginationActions.onPrev = this.onPrev;
    paginationActions.onLast = this.onLast;

    if (currentPageData.length === 0 || data.list.length === 0) {
      return null;
    }

    return (
      <TableFooter>
        <TableRow>
          <CustomTablePagination
            colSpan={6}
            count={parseInt(data.list.length, 10)}
            rowsPerPage={parseInt(rowsPerPage, 10)}
            page={parseInt(currentPageNumber, 10)}
            paginationActions={paginationActions}
          />
        </TableRow>
      </TableFooter>
    );
  };

  render() {
    const { classes, isLoading } = this.props;

    return (
      <div className={classes.wrapper}>
        {isLoading === true && (
          <LinearProgress size={24} style={{ height: 1.5 }} />
        )}
        {isLoading === true && <Overlay />}

        <Paper className={classes.root}>
          <Table className={classes.table}>
            {this.renderHeader()}
            {this.renderBody()}
            {this.renderFooter()}
          </Table>
        </Paper>
        {this.renderNoRecordsMessage()}
      </div>
    );
  }
}

SimpleDatagrid.defaultProps = {
  actions: [],
  rowsPerPage: 10
};

export default withStyles(styles)(SimpleDatagrid);
