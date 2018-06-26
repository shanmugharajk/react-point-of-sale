import React from "react";
import currency from "currency.js";
import { Paper } from "material-ui";
import { withStyles } from "material-ui/styles";
import Form from "../../../controls/Form";
import CustomLabel from "./CustomLabel";
import NumberTextField from "../../../controls/textfields/NumberTextField";

const styles = theme => ({
  textField: {
    width: "470px",
    [theme.breakpoints.up("md")]: {
      width: "470px"
    }
  }
});

const NormalSaleForm = props => {
  const {
    errors,
    data,
    transactionId,
    cart,
    classes,
    onChange,
    onSubmit,
    onCancel
  } = props;
  const { summary } = cart;

  const totalDiscount = currency(summary.discountOnItems)
    .add(summary.discountOnTotal)
    .toString();

  return (
    <Paper>
      <Form
        style={{ marginLeft: "0px", padding: "15px" }}
        id="customer"
        onSubmit={onSubmit}
        onCancel={onCancel}
      >
        <CustomLabel
          labelStyle={{ color: "red" }}
          title="Transaction Id"
          text={transactionId}
          helperText="Please note this id incase of any error while saving."
        />
        <br />

        <CustomLabel title="Total bill amount" text={summary.total} />
        <br />

        <CustomLabel title="Total discount amount" text={totalDiscount} />
        <br />

        <CustomLabel title="Total tax" text={summary.taxAmount} />
        <br />

        <CustomLabel title="Net bill" text={summary.netTotal} />
        <br />

        <NumberTextField
          autoFocus
          className={classes.textField}
          error={!!errors.amountPaid}
          name="amountPaid"
          value={data.amountPaid}
          label="Amount paid"
          onChange={onChange}
          helperText={errors.amountPaid}
        />
        <br />

        <CustomLabel title="Balance to pay" text={data.balanceToPay} />
      </Form>
    </Paper>
  );
};

export default withStyles(styles, { withTheme: true })(NormalSaleForm);
