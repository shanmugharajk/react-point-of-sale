import React from "react";
import { makeStyles } from "@material-ui/styles";
import { IconButton } from "@material-ui/core";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

import styles from "./paginationActions.style";

interface IProps {
  count: number;
  page: number;
  rowsPerPage: number;
  paginationActions: {
    onFirst: () => void;
    onPrev: () => void;
    onLast: () => void;
    onNext: () => void;
  };
}

const PaginationActions = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const { count, page, rowsPerPage, paginationActions } = props;
  const { onFirst, onPrev, onLast, onNext } = paginationActions;

  return (
    <div className={classes.root}>
      <IconButton
        onClick={onFirst}
        disabled={page === 1}
        aria-label="First Page"
      >
        <FirstPageIcon />
      </IconButton>

      <IconButton
        onClick={onPrev}
        disabled={page === 1}
        aria-label="Previous Page"
      >
        <KeyboardArrowLeft />
      </IconButton>

      <IconButton
        onClick={onNext}
        disabled={page >= Math.ceil(count / rowsPerPage)}
        aria-label="Next Page"
      >
        <KeyboardArrowRight />
      </IconButton>

      <IconButton
        onClick={onLast}
        disabled={page >= Math.ceil(count / rowsPerPage)}
        aria-label="Last Page"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
};

export default PaginationActions;
