defmodule Epos.Sales do
  import Ecto.Query, warn: false
  alias Epos.Repo

  alias Epos.Sales.{Validations}
  alias Epos.CreditTransactions
  alias Epos.Transactions.{TransactionStatus}
  alias Epos.{Products, Transactions, Stocks}
  alias Epos.Helpers.{TransactionsHelper}

  @doc """
  Validates the cart_info
  Updates the transaction_details and transactions table with the cart item.
  transaction_details => upserts based on record is exists or not.
  transactions => updates the bill_price, discount_on_items_price.
  """
  def update_cart(cart_info) do
    Repo.transaction(fn ->
      with {:ok, td} <- do_update_cart(cart_info) do
        {:ok, td}
      else
        {:error, error} -> Repo.rollback(error)
      end
    end)
  end

  @doc """
  Delete the trnsaction_details, transactions associated with the transaction_id
  """
  def delete_cart(transactions_id) do
    Repo.transaction(fn ->
      with {:ok, true} <- do_delete_cart(transactions_id) do
        {:ok, true}
      else
        {:error, error} -> Repo.rollback(error)
      end
    end)
  end

  @doc """
  Deletes an item from the transaction_details and updates the transactions accordingly.
  """
  def delete_item_from_cart(transaction_id, product_id) do
    Repo.transaction(fn ->
      with {:ok, _td_deleted} <- do_delete_item_from_cart(transaction_id, product_id) do
        {:ok, true}
      else
        {:error, error} -> Repo.rollback(error)
      end
    end)
  end

  @doc """
  Updates the transactions, stocks table and complets the sale.
  """
  def counter_sale_checkout(checkout_details) do
    Repo.transaction(fn ->
      with {:ok, true} <- Validations.counter_sale_checkout_details_is_valid(checkout_details),
           {:ok, t} <- do_sale_checkout(checkout_details) do
        {:ok, t}
      else
        {:error, error} -> Repo.rollback(error)
      end
    end)
  end

  @doc """
  Gets all the details regarding the transaction_id and adds them
  in transactions, transactions_detail table with the status SALE_PENDING
  which is ready for checkout.
  """
  def clone_sale(transaction_id, created_by) do
    new_transaction_id = TransactionsHelper.generate_transation_id()

    Repo.transaction(fn ->
      with {:ok, [{t, _td} | _tail] = res} <- Transactions.get_sale_transaction(transaction_id),
           {:ok, t_updated} <- clone_transaction(new_transaction_id, created_by, t),
           {:ok, td_updated} <- clone_transaction_details(res, new_transaction_id, created_by, []) do
        {:ok, {t_updated, td_updated}}
      else
        {:error, error} -> Repo.rollback(error)
        error -> Repo.rollback(error)
      end
    end)
  end

  @doc """
  Updates the transacations, stocks, customer credit details and completes the sale.
  """
  def credit_sale_checkout(checkout_details) do
    transaction_id = checkout_details["transaction_id"]
    customer_id = checkout_details["customer_id"]

    Repo.transaction(fn ->
      with {:ok, true} <- Validations.credit_sale_checkout_details_is_valid(checkout_details),
           {:ok, true} <- Transactions.update_customer_info(transaction_id, customer_id),
           {:ok, t} <- do_sale_checkout(checkout_details),
           {:ok, cd} <- update_credit_sale_params(t, checkout_details, :add),
           {:ok, ct} <- CreditTransactions.save_transactions(cd) do
        {:ok, ct, t}
      else
        {:error, error} -> Repo.rollback(error)
      end
    end)
  end

  @doc """
  Reverts the sale - updates the transaction_status as SALE_REVERT and make all
  items associated with the transaction as in active and updates the stocks.
  """
  def revert_counter_sale(transaction_id, updated_by) do
    Repo.transaction(fn ->
      with {:ok, true} <- Transactions.revert_sale(transaction_id, updated_by),
           {:ok, td} <- Transactions.get_transaction_detail(transaction_id),
           {:ok, true} <- Stocks.update_stock(td, updated_by, :add) do
        {:ok, true}
      else
        {:error, error} -> Repo.rollback(error)
        error -> Repo.rollback(error)
      end
    end)
  end

  @doc """
  Reverts the sale - updates the transaction_status as SALE_REVERT and make all
  items associated with the transaction as in active, updates the stocks and also
  adds the balance amount to the account of the customer.
  """
  def revert_credit_sale(checkout_details) do
    transaction_id = checkout_details["transaction_id"]
    updated_by = checkout_details["updated_by"]

    extractor = fn list -> {:ok, Enum.map(list, fn {_t, td} -> td end)} end

    Repo.transaction(fn ->
      with {:ok, true} <- Transactions.revert_sale(transaction_id, updated_by, true),
           {:ok, [{t, _td} | _tail] = res} <-
             Transactions.get_sale_transaction(transaction_id, false),
           {:ok, td} <- extractor.(res),
           {:ok, true} <- Stocks.update_stock(td, updated_by, :add),
           {:ok, cd} <- update_credit_sale_params(t, checkout_details, :sub),
           {:ok, ct} <- CreditTransactions.save_transactions(cd) do
        {:ok, ct}
      else
        {:error, error} -> Repo.rollback(error)
      end
    end)
  end

  def credit_payment(payment_details) do
    Repo.transaction(fn ->
      with {:ok, ct} <- CreditTransactions.save_transactions(payment_details) do
        {:ok, ct}
      else
        {:error, error} -> Repo.rollback(error)
      end
    end)
  end

  # This calculation is done for revert credit sale.
  defp update_credit_sale_params(transaction, checkout_details, :sub) do
    res = update_credit_sale_params(transaction, checkout_details)

    updated =
      res
      |> Map.put("total_debt_price", Money.multiply(res["total_debt_price"], -1))
      |> Map.put("balance_price", Money.multiply(res["balance_price"], -1))

    {:ok, updated}
  end

  # This calculation is for credit sale checkout.
  defp update_credit_sale_params(transaction, checkout_details, :add) do
    {:ok, update_credit_sale_params(transaction, checkout_details)}
  end

  # Creates a map from transaction map and the user checkout_details
  # to add the details to credit_transaction table.
  defp update_credit_sale_params(transaction, checkout_details) do
    current_balance_price = Money.subtract(transaction.net_price, transaction.paid_price)

    checkout_details
    |> Map.put("transaction_id", transaction.transactions_id)
    |> Map.put("bill_price", transaction.net_price)
    |> Map.put("paid_price", transaction.paid_price)
    |> Map.put("paid_date", checkout_details["sale_date"])
    |> Map.put("customer_id", transaction.customer_id)
    |> Map.put("balance_price", current_balance_price)
    |> Map.put("total_debt_price", current_balance_price)
  end

  # Inserts the transactions info from the struct passed
  defp clone_transaction(new_transaction_id, created_by, transaction) do
    transaction
    |> Map.put(:transactions_id, new_transaction_id)
    |> Map.put(:created_by, created_by)
    |> Map.put(:updated_by, created_by)
    |> Map.put(:updated_at, DateTime.truncate(DateTime.utc_now(), :second))
    |> Map.put(:inserted_at, DateTime.truncate(DateTime.utc_now(), :second))
    |> Map.put(:transaction_status, TransactionStatus.sale_pending())
    |> Map.delete(:customers)
    |> Transactions.create_transaction_from_struct()
  end

  # Inserts the transaction_details info from the struct passed
  defp clone_transaction_details(
         [{_t, td} | tail],
         new_transaction_id,
         created_by,
         results
       ) do
    td
    |> Map.put(:transaction_details_id, new_transaction_id)
    |> Map.put(:created_by, created_by)
    |> Map.put(:updated_by, created_by)
    |> Map.put(:updated_at, DateTime.truncate(DateTime.utc_now(), :second))
    |> Map.put(:inserted_at, DateTime.truncate(DateTime.utc_now(), :second))
    |> Map.put(:is_reverted, false)
    |> Map.delete(:products)
    |> Map.delete(:transactions)
    |> Transactions.create_transaction_details_from_struct()
    |> case do
      {:ok, td_updated} ->
        clone_transaction_details(tail, new_transaction_id, created_by, results ++ [td_updated])

      _ ->
        {:error, "Error in cloning transaction_details."}
    end
  end

  # Inserts the transaction_details info from the struct passed
  defp clone_transaction_details(
         [],
         _new_transaction_id,
         _created_by,
         results
       ) do
    {:ok, results}
  end

  # Updates the summary in the transaactions table and update the stock accordingly.
  defp do_sale_checkout(checkout_details) do
    with {:ok, td} <- Transactions.get_transaction_detail(checkout_details["transaction_id"]),
         {:ok, t} <- Transactions.get_transaction(checkout_details["transaction_id"]),
         {:ok, t_updated} <- update_transaction_summary(t, checkout_details),
         {:ok, true} <- Stocks.update_stock(td, checkout_details["updated_by"], :sub) do
      {:ok, t_updated}
    else
      {:error, error} -> {:error, error}
      _ -> {:error, "Failed to do the checkout."}
    end
  end

  # Deletes the transaction_details and update the total in the transactions.
  defp do_delete_item_from_cart(transaction_id, product_id) do
    with {:ok, td} <- Transactions.get_transaction_detail(transaction_id, product_id),
         {n, _} when n > 0 <- Transactions.delete_transaction_detail(transaction_id, product_id) do
      {:ok, td}
    else
      {:error, error} -> {:error, error}
      _ -> {:error, "Failed to delete the item in cart"}
    end
  end

  # Validates the transation_id
  # Gets the transaction_detail list matching transation_id
  # Deletes all the matching rows for transation_id in the transation_details, transactions
  defp do_delete_cart(transactions_id) do
    with {:ok, true} <- Transactions.is_valid_transaction_id(transactions_id),
         {n, _} when n >= 0 <- Transactions.delete_transaction_detail(transactions_id),
         {n, _} when n > 0 <- Transactions.delete_transaction(transactions_id) do
      {:ok, true}
    else
      {:error, error} -> {:error, error}
      _ -> {:error, "Failed to delete the cart."}
    end
  end

  # Validated cart_info and Update the item total and upsert ub the trnsacation_detail table.
  # Updates the transactions table bill_price, discount_on_items_price.
  defp do_update_cart(cart_info, status \\ TransactionStatus.sale_pending()) do
    with {:ok, true} <- Validations.cart_info_is_valid(cart_info, status),
         {:ok, updated_cart} <- update_bill_total_in_cart(cart_info),
         {:ok, td} <- Transactions.upsert_transaction_detail(updated_cart) do
      {:ok, td}
    else
      {:error, error} -> {:error, error}
      {:error, error, _, _} -> {:error, error}
    end
  end

  # Calculates the net_price and updates the transactions with the details given.
  defp update_transaction_summary(
         transaction,
         summary,
         status \\ TransactionStatus.sale_complete()
       ) do
    with {:ok, res} <-
           Transactions.get_summary_from_transaction_detail(transaction.transactions_id) do
      bill_price = Money.new(Decimal.to_integer(res.bill_price))
      discount_on_items_price = Money.new(Decimal.to_integer(res.discount_total_price))
      tax_m = Money.new(summary["tax_price"])

      discount_on_total_m = Money.new(summary["discount_on_total_price"])

      to_minus_m =
        Money.add(tax_m, discount_on_total_m)
        |> Money.add(discount_on_items_price)

      net_price_m = Money.subtract(bill_price, to_minus_m)
      # Incase of counter sale the paid_price is same as the net_price.
      # So defaulting to that.
      paid_price_m = Map.get(summary, "paid_price", net_price_m.amount)

      summary_updated =
        summary
        |> Map.put("bill_price", bill_price.amount)
        |> Map.put("net_price", net_price_m.amount)
        |> Map.put("transaction_status", status)
        |> Map.put("paid_price", paid_price_m)

      Transactions.update_transaction(transaction, summary_updated)
    else
      _ -> {:error, "Error in updating transaction total."}
    end
  end

  # Updates the bill_total, net_total, discount_total_price by fetching thr amount
  # from the Producy table in cart_info and send the updated cart_info.
  defp update_bill_total_in_cart(cart_info) do
    with {:ok, product} <- Products.get_product(cart_info["product_id"]) do
      discount_price = Money.new(cart_info["discount_price"])
      discounted_price = Money.subtract(product.selling_price, discount_price)
      net_price = Money.multiply(discounted_price, cart_info["qty"])
      bill_price = Money.multiply(product.selling_price, cart_info["qty"])
      discount_total_price = Money.multiply(discount_price, cart_info["qty"])

      info =
        cart_info
        |> Map.put("cost_price", product.cost_price)
        |> Map.put("selling_price", product.selling_price)
        |> Map.put("discount_total_price", discount_total_price)
        |> Map.put("net_price", net_price)
        |> Map.put("bill_price", bill_price)

      {:ok, info}
    else
      _ -> {:error, "Invalid product code"}
    end
  end
end
