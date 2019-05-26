import React from "react";

import { Hidden, Drawer, Theme } from "@material-ui/core";
import { useTheme, makeStyles } from "@material-ui/styles";

import Menus from "./menus/Menus";
import styles from "./sidebar.style";

interface IProps {
  drawerWidth: number;
  container?: any;
  handleDrawerToggle: any;
}

const Sidebar = (props: IProps) => {
  const useStyles = makeStyles(styles(props.drawerWidth));
  const classes = useStyles();

  const theme: Theme = useTheme();
  const mobileOpen = false;

  return (
    <nav className={classes.drawer}>
      <Hidden mdUp implementation="css">
        <Drawer
          container={props.container}
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={mobileOpen}
          onClose={props.handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <Menus />
        </Drawer>
      </Hidden>
      <Hidden mdDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          open
        >
          <Menus />
        </Drawer>
      </Hidden>
    </nav>
  );
};

export default Sidebar;
