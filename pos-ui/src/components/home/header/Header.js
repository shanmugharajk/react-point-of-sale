import React, { Component, Fragment } from "react";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";
import Menus from "./Menus";

const drawerWidth = 200;

// eslint-disable-next-line
const styles = theme => ({
  appBar: {
    position: "absolute",
    marginLeft: drawerWidth,
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  appBarFullWidth: {
    width: "100%"
  },
  flex: {
    flex: 1
  },
  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  navIconShow: {
    display: "block"
  },
  logo: {
    background: "#3f51b5"
  },
  logoContainer: {
    color: "white",
    "&:only-child > span": {
      padding: "4px 0px 0px 10px",
      fontWeight: "lighter"
    }
  }
});

class Header extends Component {
  state = {};

  render() {
    const { classes, handleDrawerToggle, shouldRenderMobileMenu } = this.props;

    const navIconClass =
      shouldRenderMobileMenu === true
        ? classes.navIconShow
        : classes.navIconHide;

    const appBarClass =
      shouldRenderMobileMenu === true
        ? classes.appBarFullWidth
        : classes.appBar;

    return (
      <Fragment>
        <AppBar className={appBarClass}>
          <Toolbar>
            {/* Collapse button. Clicking this opens the drawer */}
            <div className={classNames(classes.logo, navIconClass)}>
              <div className={classes.logoContainer}>
                <IconButton
                  style={{ margin: 0 }}
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
                <span>Point Of Sale</span>
              </div>
            </div>

            {/* This is the right side menu - Logout, My Profile */}
            <div className={classes.flex}>
              <Menus />
            </div>
          </Toolbar>
        </AppBar>
      </Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Header);
