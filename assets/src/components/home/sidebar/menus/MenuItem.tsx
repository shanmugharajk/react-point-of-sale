import React from "react";
import classNames from "classnames";

import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import styles from "./menuItem.style";

interface IProps {
  isSelected: boolean;
  onClick: any;
  icon: any;
  text: string;
}

const MenuItem = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const getClassName = () => {
    if (props.isSelected) return classNames(classes.listItem, classes.selected);
    return classNames(classes.listItem, classes.normal);
  };

  return (
    <ListItem button onClick={props.onClick} className={getClassName()}>
      <ListItemIcon className={classes.icon}>{props.icon}</ListItemIcon>
      <ListItemText
        style={{ padding: 2 }}
        classes={{ primary: classes.primary }}
        primary={props.text}
      />
    </ListItem>
  );
};

export default MenuItem;
