import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@material-ui/core";

interface IProps {
  open: boolean;
  message: string;
  onCancel: () => void;
  onOk: () => void;
}

const YesNo = (props: IProps) => (
  <Dialog
    open={props.open}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">Message</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {props.message}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onCancel} color="primary" autoFocus>
        Cancel
      </Button>
      <Button onClick={props.onOk} color="secondary" autoFocus>
        Ok
      </Button>
    </DialogActions>
  </Dialog>
);

export default YesNo;
