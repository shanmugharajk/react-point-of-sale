defmodule Epos.Transactions.TransactionStatus do
  @counter_sale "COUNTER_SALE"
  @sale_pending "PENDING"
  @sale_complete "SALE_COMPLETE"
  @sale_revert "SALE_REVERT"
  @sale_revert_partial "SALE_REVERT_PARTIAL"
  @credit_sale "CREDIT_SALE"

  def counter_sale, do: @counter_sale
  def sale_pending, do: @sale_pending
  def sale_complete, do: @sale_complete
  def sale_revert, do: @sale_revert
  def sale_revert_partial, do: @sale_revert_partial
  def credit_sale, do: @credit_sale
end
