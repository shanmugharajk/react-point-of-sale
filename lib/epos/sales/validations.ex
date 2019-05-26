defmodule Epos.Sales.Validations do
  alias Epos.Transactions
  alias Epos.Transactions.{TransactionStatus}

  def cart_info_is_valid(cart_info, status \\ TransactionStatus.sale_pending()) do
    cond do
      is_nil(cart_info["qty"]) == true or cart_info["qty"] <= 0 ->
        {:error, "Invalid cart quantity."}

      is_nil(cart_info["discount_price"]) == true or cart_info["discount_price"] < 0 or
          is_integer(cart_info["discount_price"]) == false ->
        {:error, "Invalid discount_price."}

      true ->
        cart_info["transaction_id"]
        |> Transactions.is_valid_transaction_id(status)
    end
  end

  def credit_sale_checkout_details_is_valid(checkout_details) do
    with {:ok, true} <- counter_sale_checkout_details_is_valid(checkout_details) do
      cond do
        is_nil(checkout_details["paid_price"]) == true or
          is_integer(checkout_details["paid_price"]) == false or
            checkout_details["paid_price"] <= 0 ->
          {:error, "Invalid paid_price."}

        is_nil(checkout_details["customer_id"]) == true or
            is_bitstring(checkout_details["customer_id"]) == false ->
          {:error, "Invalid customer_id."}

        true ->
          {:ok, true}
      end
    else
      {:error, error} -> {:error, error}
    end
  end

  def counter_sale_checkout_details_is_valid(checkout_details) do
    cond do
      is_nil(checkout_details["discount_on_total_price"]) == true or
        checkout_details["discount_on_total_price"] <= 0 or
          is_integer(checkout_details["discount_on_total_price"]) == false ->
        {:error, "Invalid discount_on_total_price."}

      is_nil(checkout_details["tax_price"]) == true or checkout_details["tax_price"] <= 0 or
          is_integer(checkout_details["tax_price"]) == false ->
        {:error, "Invalid tax_price."}

      is_nil(checkout_details["sale_date"]) == true ->
        {:error, "Invalid sale_date."}

      true ->
        checkout_details["transaction_id"]
        |> Transactions.is_valid_transaction_id()
    end
  end
end
