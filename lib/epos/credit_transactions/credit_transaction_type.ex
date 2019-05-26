defmodule Epos.CreditTransactions.CreditTransactionType do
  @record_entry "RECORD_ENTRY"
  @credit_payment "CREDIT_PAYMENT"
  @credit_sale_payment "CREDIT_SALE_PAYMENT"
  @credit_sale_revert_payment "CREDIT_SALE_REVERT_PAYMENT"
  @credit_payment_adjustment "CREDIT_PAYMENT_ADJUSTMENT"

  def record_entry, do: @record_entry
  def credit_payment, do: @credit_payment
  def credit_payment_adjustment, do: @credit_payment_adjustment
  def credit_sale_payment, do: @credit_sale_payment
  def credit_sale_revert_payment, do: @credit_sale_revert_payment
end
