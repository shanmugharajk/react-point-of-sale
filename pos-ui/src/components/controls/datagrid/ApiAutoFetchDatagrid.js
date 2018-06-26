import React, { Component } from "react";
import classNames from "classnames";
import axios from "axios";
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
import { getPaginationInfo } from "../../../utils";

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
  },
  gridEdit: {
    border: "none",
    minWidth: "29px",
    overflow: "hidden",
    outline: 0,
    lineHeight: 1,
    "&:focus": {
      outline: 0,
      backgroundColor: "#f3f9fd",
      borderRadius: "1px",
      boxShadow: "0 0 0 2px #f3f9fd, 0 0 0 4px #cdd4d9"
    }
  },
  gridNumberEdit: {
    textAlign: "right",
    width: "20px"
  }
});

class ApiAutoFetchDatagrid extends Component {
  state = {
    data: {
      list: [],
      paginationInfo: {}
    },
    isLoading: false
  };

  async componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps);
  }

  init = async (props = this.props) => {
    this.setState({ isLoading: true });

    try {
      const res = await props.datasourcePromise();

      const paginationInfo = getPaginationInfo(res.headers.link);
      const list = res.data;
      const data = {
        list,
        paginationInfo
      };

      this.setState({ isLoading: false, data });
    } catch (error) {
      // TODO show error
      this.setState({ isLoading: false, data: { list: [] } });
    }
  };

  onFirst = () => {
    this.fetch("first");
  };

  onLast = () => {
    this.fetch("last");
  };

  onNext = async () => {
    this.fetch("next");
  };

  onPrev = () => {
    this.fetch("prev");
  };

  fetch = async action => {
    try {
      this.setState({ isLoading: true });

      const url = this.state.data.paginationInfo[action];
      const res = await axios.get(url);
      const paginationInfo = getPaginationInfo(res.headers.link);
      const list = res.data;
      const data = {
        list,
        paginationInfo
      };

      this.setState({ isLoading: false, data });
    } catch (error) {
      this.props.onError(error.message, true);
      this.setState({ isLoading: false, data: {} });
    }
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

  renderCellValue = (key, val) => {
    if (this.props.transformers && this.props.transformers[key]) {
      return this.props.transformers[key](val);
    }
    return val;
  };

  renderRow = row => {
    const keys = Object.keys(row);

    return keys.map((k, idx) => {
      if (this.props.actions.includes("sel") && idx === 0) {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <TableCell key={`${keys[idx]}${idx}`}>
            <Button color="primary" onClick={() => this.props.onSelect(row)}>
              {this.renderCellValue(k, row[k])}
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
              value={this.renderCellValue(k, row[k])}
              className={classNames(
                this.props.classes.gridEdit,
                this.props.classes.gridNumberEdit
              )}
            />
          </TableCell>
        );
      }

      return (
        // eslint-disable-next-line react/no-array-index-key
        <TableCell key={`${keys[idx]}${idx}`}>
          {this.renderCellValue(k, row[k])}
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

  renderBody = () => (
    <TableBody>
      {this.state.data.list.map((row, idx) => {
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

  renderNoRecordsMessage = () => {
    const { isLoading } = this.props;
    const { data } = this.state;

    return (
      <Message
        style={{ width: "100%", marginLeft: 0 }}
        title="Info"
        message="No records found"
        show={data.list.length === 0 && isLoading === false}
      />
    );
  };

  renderFooter = () => {
    const { rowsPerPage, headers } = this.props;
    const { data } = this.state;

    const paginationActions = {};
    paginationActions.onFirst = this.onFirst;
    paginationActions.onNext = this.onNext;
    paginationActions.onPrev = this.onPrev;
    paginationActions.onLast = this.onLast;

    if (data.list.length === 0 || !data.paginationInfo.count) {
      return null;
    }

    return (
      <TableFooter>
        <TableRow>
          <CustomTablePagination
            colSpan={headers.length + 1}
            count={parseInt(data.paginationInfo.count, 10)}
            rowsPerPage={parseInt(rowsPerPage, 10)}
            page={parseInt(data.paginationInfo.current, 10)}
            paginationActions={paginationActions}
          />
        </TableRow>
      </TableFooter>
    );
  };

  render() {
    const { classes } = this.props;
    const { isLoading } = this.state;

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

ApiAutoFetchDatagrid.defaultProps = {
  actions: [],
  rowsPerPage: 10
};

export default withStyles(styles)(ApiAutoFetchDatagrid);
