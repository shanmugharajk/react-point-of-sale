import React, { Component } from "react";
import currency from "currency.js";
import { connect } from "react-redux";
import { withStyles } from "material-ui/styles";
import FullPageDialog from "../../../controls/dialog/FullPageDialog";
import api from "../../../../api";
import Message from "../../../controls/Message";
import { getCartItemsArraySelector } from "../../../../selectors";
import NormalSaleForm from "./NormalSaleForm";
import CircularLoader from "../../../controls/loader/CircularLoader";
import {
  initTransaction,
  cancelTransaction
} from "../../../../actions/transaction";
import { emptyCart } from "../../../../actions/cart";
import YesNo from "../../../controls/dialog/YesNo";

const styles = () => ({
  message: {
    margin: 0,
    paddingBottom: "10px"
  },
  formContainer: {
    padding: "30px",
    margin: "auto",
    width: "500px",
    height: "100%"
  }
});

class NormalSale extends Component {
  state = {
    error: "",
    showMessage: false,
    showConfirmDeleteDialog: false,
    isLoading: false,
    errors: {},
    data: {
      balanceToPay: "0.00",
      amountPaid: ""
    }
  };

  async componentDidMount() {
    try {
      if (this.props.transaction.id) {
        return;
      }

      this.setState({ isLoading: true });

      const res = await api.transaction.getTransactionId();
      const transId = res.data;
      this.props.initTransaction(transId);

      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({
        error: error.message,
        showMessage: true,
        isLoading: false
      });
    }
  }

  onChange = e => {
    const amountPaid = e.target.value;
    const { netTotal } = this.props.cart.summary;
    const balance = currency(amountPaid).subtract(netTotal);

    if (balance.value > 0) {
      this.setState({
        errors: {},
        data: { amountPaid, balanceToPay: balance.toString() }
      });
    } else {
      this.setState({ errors: {}, data: { amountPaid, balanceToPay: "0.00" } });
    }
  };

  onNormalSaleFormSubmit = async e => {
    e.preventDefault();

    const { amountPaid } = this.state.data;
    const { cart, cartArray } = this.props;
    const { summary } = cart;
    const { netTotal } = summary;
    const balance = currency(amountPaid).subtract(netTotal);

    if (balance.value < 0) {
      this.setState({
        errors: {
          amountPaid:
            "You have entered a less amount than the bill. Please correct it"
        }
      });

      return;
    }

    const sale = {};
    sale.items = [];
    Object.assign(sale.items, cartArray);

    sale.total = currency(summary.total).value;
    sale.taxAmount = currency(summary.taxAmount).value;
    sale.totalDiscount = currency(summary.discountOnItems).add(
      summary.discountOnTotal
    ).value;
    sale.netTotal = currency(netTotal).value;

    const res = await api.transaction.saveNormalSale(sale);

    console.log(res.data);
  };

  onNormalSaleFormCancel = () => {
    this.setState({ showConfirmDeleteDialog: true });
  };

  onMessageCloseClick = () => {
    this.setState({ showMessage: false });
  };

  // Clear the transaction. If user clicks confirm yes for canceling transaction.
  onYesNoPopYesClick = () => {
    this.props.cancelTransaction();
    this.props.emptyCart();
  };

  onYesNoPopNoClick = () => {
    this.setState({ showConfirmDeleteDialog: false });
  };

  renderForm = () => {
    const { transaction, cart } = this.props;
    const { isLoading, errors, data } = this.state;

    if (isLoading === true) {
      return null;
    }

    return (
      <NormalSaleForm
        cart={cart}
        errors={errors}
        data={data}
        onSubmit={this.onNormalSaleFormSubmit}
        onCancel={this.onNormalSaleFormCancel}
        onChange={this.onChange}
        transactionId={transaction.id}
      />
    );
  };

  render() {
    const { handleClose, open, classes } = this.props;
    const {
      error,
      showMessage,
      isLoading,
      showConfirmDeleteDialog
    } = this.state;

    return (
      <FullPageDialog open={open} handleClose={handleClose} title="Normal Sale">
        <CircularLoader isLoading={isLoading} />

        <YesNo
          open={showConfirmDeleteDialog}
          message="Are you sure wan't to cancel the transaction and clear the cart?"
          onOk={() => this.onYesNoPopYesClick()}
          onCancel={() => this.onYesNoPopNoClick()}
        />

        <div className={classes.formContainer}>
          <Message
            className={classes.message}
            title="Got an error"
            message={error}
            show={showMessage}
            isError={true}
            onCloseClick={this.onMessageCloseClick}
          />
          {this.renderForm()}
        </div>
      </FullPageDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    transaction: state.transaction,
    cart: state.cart,
    cartArray: getCartItemsArraySelector(state)
  };
}

const mapDispatchToProps = {
  initTransaction,
  cancelTransaction,
  emptyCart
};

const component = withStyles(styles)(NormalSale);
export default connect(mapStateToProps, mapDispatchToProps)(component);
