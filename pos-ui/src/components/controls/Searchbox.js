import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import { InputAdornment } from "material-ui/Input";
import IconButton from "material-ui/IconButton";
import Search from "material-ui-icons/Search";
import CustomTextField from "./textfields/CustomTextField";

// eslint-disable-next-line
const styles = theme => ({
  root: {
    [theme.breakpoints.up("xs")]: {
      float: "none"
    },
    [theme.breakpoints.up("md")]: {
      float: "right"
    }
  },
  textfield: {
    width: 200
  }
});

class Searchbox extends Component {
  state = { id: "" };

  componentWillReceiveProps(nextProps) {
    if (nextProps.clear) {
      this.setState({ id: "" });
    }
  }

  onChange = e => {
    this.setState({ id: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state.id);
  };

  render() {
    const { classes, placeholder } = this.props;

    return (
      <form onSubmit={this.onSubmit} className={classes.root}>
        <CustomTextField
          onChange={this.onChange}
          value={this.state.id}
          style={{ width: 200 }}
          placeholder={placeholder !== undefined ? placeholder : "Enter ID"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={this.onSubmit}>
                  <Search />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </form>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Searchbox);
