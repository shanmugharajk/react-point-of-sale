import React from "react";
import DeleteIcon from "material-ui-icons/Delete";
import { IconButton, withStyles } from "material-ui";

const styles = () => ({
  deleteIcon: {
    color: "#949494"
  }
});

const DeleteButton = ({ onDelete, classes }) => (
  <IconButton onClick={() => onDelete()}>
    <DeleteIcon className={classes.deleteIcon} />
  </IconButton>
);

export default withStyles(styles)(DeleteButton);
