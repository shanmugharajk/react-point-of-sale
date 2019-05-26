import React, { ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";

interface IProps {
  open: boolean;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  onSave: () => {};
  onCancel: () => {};
}
const FormDialog = (props: IProps) => (
  <Dialog
    open={props.open}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {props.title ? props.title : "Edit Item"}
      <br />
      <span style={{ fontSize: "12px", color: "#3f50b5" }}>
        {props.subtitle ? `(${props.subtitle})` : ""}
      </span>
    </DialogTitle>
    <DialogContent>{props.children}</DialogContent>
    <DialogActions>
      <Button onClick={props.onSave} color="primary" autoFocus>
        Save
      </Button>
      <Button onClick={props.onCancel} color="secondary" autoFocus>
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

export default FormDialog;
