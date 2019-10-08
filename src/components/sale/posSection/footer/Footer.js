import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles, Button } from "material-ui";
import NormalSale from "../sale/NormalSale";

const styles = () => ({
  root: {
    marginTop: "20px"
  },
  button: {
    marginBottom: "1px",
    boxShadow: "none"
  }
});

class Footer extends Component {
  state = {
    showNormalPopup: false
  };

  normalSaleClick = () => {
    this.setState({ showNormalPopup: true });
  };

  handleNormalSaleClose = () => {
    this.setState({ showNormalPopup: false });
  };

  render() {
    const { showNormalPopup } = this.state;
    const { classes, summary } = this.props;

    if (summary.noOfItems === 0) {
      return null;
    }

    return (
      <div className={classes.root}>
        {showNormalPopup && (
          <NormalSale
            open={showNormalPopup}
            handleClose={this.handleNormalSaleClose}
          />
        )}
        <Button
          className={classes.button}
          variant="raised"
          color="default"
          fullWidth
          onClick={this.normalSaleClick}
        >
          Normal Sale
        </Button>

        <Button
          className={classes.button}
          variant="raised"
          color="default"
          fullWidth
          onClick={this.creditSaleClick}
        >
          Credit Sale
        </Button>
      </div>
    );
  }
}

function mapStateToProps({ cart }) {
  return {
    summary: cart.summary
  };
}

const component = withStyles(styles)(Footer);
export default connect(mapStateToProps)(component);
