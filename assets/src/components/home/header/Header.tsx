import React from "react";
import MenuIcon from "@material-ui/icons/Menu";

import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar, IconButton } from "@material-ui/core";

import styles from "./header.style";

interface IProps {
  drawerWidth: number;
  handleDrawerToggle: any;
}

const Header = (props: IProps) => {
  const useStyles = makeStyles(styles(props.drawerWidth));
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={props.handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
