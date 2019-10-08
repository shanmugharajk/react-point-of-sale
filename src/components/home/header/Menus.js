import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withStyles } from "material-ui/styles";
import AccountCircle from "material-ui-icons/AccountCircle";
import Menu, { MenuItem } from "material-ui/Menu";
import IconButton from "material-ui/IconButton";
import { logout } from "../../../actions/auth";

// eslint-disable-next-line
const styles = theme => ({
  menuLeft: {
    float: "right"
  },
  menuItem: {
    fontSize: "13.5px",
    padding: "5px 20px 5px 20px"
  }
});

class Menus extends Component {
  state = { anchorEl: null };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  logout = () => {
    this.props.logout();
  };

  myProfile = () => {
    //
  };

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;
    const open = Boolean(anchorEl);

    return (
      <Fragment>
        {/* This is right corner menu [logout, my profile] */}
        <IconButton
          className={classes.menuLeft}
          aria-owns={open ? "menu-appbar" : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={open}
          onClose={this.handleClose}
        >
          <MenuItem className={classes.menuItem} onClick={this.myProfile}>
            My Profile
          </MenuItem>
          <MenuItem className={classes.menuItem} onClick={this.logout}>
            Logout
          </MenuItem>
        </Menu>
      </Fragment>
    );
  }
}

export default connect(null, { logout })(
  withStyles(styles, { withTheme: true })(Menus)
);
