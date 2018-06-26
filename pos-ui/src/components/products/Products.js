import React, { Component } from "react";
import { withRouter } from "react-router";
import { withStyles } from "material-ui/styles";
import CustomTabs from "../controls/Tabs";
import TabContainer from "../controls/TabContainer";
import ProductTab from "./ProductTab";
import ProductTypeTab from "./ProductTypeTab";

const styles = theme => ({
  root: {
    padding: 10
  },
  tabHolder: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  tab: {
    boxShadow: "none"
  },
  tabItem: {
    fontSize: "12px"
  },
  indicator: {
    backgroundColor: "#3f51b5"
  }
});

class Products extends Component {
  state = {
    value: 0
  };

  componentDidMount() {
    if (this.props.history.location.pathname === "/products") {
      this.setState({ value: 0 });
    } else {
      this.setState({ value: 1 });
    }
  }

  handleChange = (event, value) => {
    if (value === 0) {
      this.props.history.push("/products");
    } else {
      this.props.history.push("/producttypes");
    }
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div>
        <div className={classes.tabHolder}>
          <CustomTabs
            onChange={this.handleChange}
            value={value}
            items={["Products", "Product Types"]}
          />
          {value === 0 && (
            <TabContainer>
              <ProductTab />
            </TabContainer>
          )}
          {value === 1 && (
            <TabContainer>
              <ProductTypeTab />
            </TabContainer>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Products));
