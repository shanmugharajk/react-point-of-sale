import React, { ReactNode } from "react";
import CloseIcon from "@material-ui/icons/Close";

import {
  Slide,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import styles from "./fullPageDialog.style";

const Transition = (props: {}) => <Slide direction="up" {...props} />;

interface IProps {
  open: boolean;
  handleClose: () => {};
  children: ReactNode;
  title: string;
}

const FullPageDialog = ({ open, handleClose, children, title }: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title}>
            {title}
          </Typography>
          <IconButton color="inherit" onClick={handleClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {children}
    </Dialog>
  );
};

export default FullPageDialog;
