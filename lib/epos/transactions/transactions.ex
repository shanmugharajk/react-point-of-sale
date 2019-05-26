defmodule Epos.Transactions do
  import Ecto.Query, warn: false
  alias Epos.Repo

  alias Epos.Sales.SaleType
  alias Epos.Transactions.{Transaction, TransactionDetail, TransactionStatus}
  alias Epos.Helpers.{TransactionsHelper}

  def init_transaction(customer_id, user_id) do
    if customer_id == nil or user_id == nil do
      {:error, "Invalid customer_id or user_id sent"}
    else
      transaction_info = get_transaction_object(customer_id, user_id)

      with {:ok, _} <- create_transaction(transaction_info),
           do: {:ok, transaction_info["transactions_id"]}
    end
  end

  def is_valid_transaction_id(id, status \\ TransactionStatus.sale_pending()) do
    from(t in Transaction,
      where: t.transactions_id == ^id and t.transaction_status == ^status,
      select: count(t.transactions_id)
    )
    |> Repo.one()
    |> case do
      1 ->
        {:ok, true}

      _ ->
        {:error, "Invalid transaction id sent."}
    end
  end

  def revert_sale(transaction_id, updated_by, is_credit_sale \\ false) do
    with {:ok, true} <-
           set_sale_revert_in_transaction(transaction_id, updated_by, is_credit_sale),
         {:ok, true} <- set_items_inactive_in_transaction_detail(transaction_id, updated_by) do
      {:ok, true}
    else
      {:error, error} -> Repo.rollback(error)
    end
  end

  def update_customer_info(transactions_id, customer_id) do
    from(t in Transaction,
      where: t.transactions_id == ^transactions_id,
      update: [
        set: [customer_id: ^customer_id]
      ]
    )
    |> Repo.update_all([])
    |> case do
      {1, nil} -> {:ok, true}
      _ -> {:error, "Failed to update the customer info.."}
    end
  end

  def update_transaction_total(transactions_id, info) do
    from(t in Transaction,
      where: t.transactions_id == ^transactions_id,
      update: [
        set: [updated_by: ^info.updated_by, updated_at: ^DateTime.utc_now()],
        inc: [
          bill_price: ^info.bill_price.amount,
          discount_on_items_price: ^info.discount_on_items_price.amount
        ]
      ]
    )
    |> Repo.update_all([])
    |> case do
      {1, nil} -> {:ok, true}
      _ -> {:error, "Failed to update transaction total.."}
    end
  end

  @doc """
  Finds the matching record with transaction_details_id & product_id
  If records available then it will update or else it will insert.
  RESULT -> {:ok | :error, td}
  """
  def upsert_transaction_detail(transaction_detail) do
    id = transaction_detail["transaction_details_id"]
    product_id = transaction_detail["product_id"]

    from(td in TransactionDetail,
      where: td.transaction_details_id == ^id and td.product_id == ^product_id,
      lock: "FOR UPDATE",
      select: td
    )
    |> Repo.one()
    |> case do
      nil -> create_transaction_detail(transaction_detail)
      info -> update_transaction_detail(info, transaction_detail)
    end
  end

  def update_transaction_detail(transaction_detail, attrs) do
    transaction_detail
    |> TransactionDetail.changeset(attrs)
    |> Repo.update()
  end

  def update_transaction(transaction, attrs) do
    transaction
    |> Transaction.changeset(attrs)
    |> Repo.update()
  end

  def get_sale_transaction(transaction_id, include_pending_sale \\ true) do
    from(t in Transaction,
      join: td in TransactionDetail,
      where:
        t.transactions_id == ^transaction_id and td.transaction_details_id == ^transaction_id and
          (t.transaction_status != ^TransactionStatus.sale_pending() or
             ^include_pending_sale == true),
      select: {t, td}
    )
    |> Repo.all()
    |> case do
      [] -> {:error, "Invalid transaction id"}
      res -> {:ok, res}
    end
  end

  def get_summary_from_transaction_detail(transaction_id) do
    res =
      from(td in TransactionDetail,
        where: td.transaction_details_id == ^transaction_id,
        select: %{
          discount_total_price: sum(td.discount_total_price),
          bill_price: sum(td.bill_price)
        }
      )
      |> Repo.one()

    cond do
      is_nil(res.discount_total_price) -> {:error, false}
      true -> {:ok, res}
    end
  end

  def get_transaction_detail_count(id) do
    from(td in TransactionDetail,
      where: td.transaction_details_id == ^id,
      lock: "FOR UPDATE",
      select: count(td.transaction_details_id)
    )
    |> Repo.one()
    |> case do
      rows when is_number(rows) -> {:ok, rows}
      _ -> {:error, "Invalid transaction id sent."}
    end
  end

  def get_transaction_detail(id) do
    from(td in TransactionDetail,
      where: td.transaction_details_id == ^id,
      lock: "FOR UPDATE",
      select: td
    )
    |> Repo.all()
    |> case do
      [] -> {:error, "No records"}
      transaction_details -> {:ok, transaction_details}
    end
  end

  def get_transaction_detail(id, product_id) do
    from(td in TransactionDetail,
      where: td.transaction_details_id == ^id and td.product_id == ^product_id,
      lock: "FOR UPDATE",
      select: td
    )
    |> Repo.one()
    |> case do
      nil -> {:error, "No records"}
      transaction_detail -> {:ok, transaction_detail}
    end
  end

  def get_transaction(id) do
    from(t in Transaction,
      where: t.transactions_id == ^id,
      lock: "FOR UPDATE",
      select: t
    )
    |> Repo.one()
    |> case do
      nil -> {:error, "No records"}
      transaction -> {:ok, transaction}
    end
  end

  def transaction_detail_bulk_insert_from_struct(list_of_items) do
    Repo.insert_all(TransactionDetail, list_of_items)
  end

  def create_transaction_detail(transaction_detail) do
    %TransactionDetail{}
    |> TransactionDetail.changeset(transaction_detail)
    |> Repo.insert()
  end

  def create_transaction_from_struct(transaction_info) do
    Repo.insert(transaction_info)
  end

  def create_transaction_details_from_struct(transaction_info) do
    Repo.insert(transaction_info)
  end

  def create_transaction(transaction_info) do
    %Transaction{}
    |> Transaction.changeset(transaction_info)
    |> Repo.insert()
  end

  def delete_transaction_detail(transaction_id) do
    from(td in TransactionDetail, where: td.transaction_details_id == ^transaction_id)
    |> Repo.delete_all()
  end

  def delete_transaction_detail(transaction_id, product_id) do
    from(td in TransactionDetail,
      where: td.transaction_details_id == ^transaction_id and td.product_id == ^product_id
    )
    |> Repo.delete_all()
  end

  def delete_transaction(transaction_id, status \\ TransactionStatus.sale_pending()) do
    from(t in Transaction,
      where: t.transactions_id == ^transaction_id and t.transaction_status == ^status
    )
    |> Repo.delete_all()
  end

  defp set_items_inactive_in_transaction_detail(transaction_id, updated_by) do
    from(t in TransactionDetail,
      where: t.transaction_details_id == ^transaction_id,
      update: [
        set: [
          updated_by: ^updated_by,
          updated_at: ^DateTime.utc_now(),
          is_reverted: true
        ]
      ]
    )
    |> Repo.update_all([])
    |> case do
      {rows, nil} when rows == 0 ->
        {:error, "All items are already reverted for this transaction."}

      {rows, nil} when rows > 0 ->
        {:ok, true}
    end
  end

  defp set_sale_revert_in_transaction(transaction_id, updated_by, is_credit_sale) do
    from(t in Transaction,
      where:
        t.transactions_id == ^transaction_id and
          t.transaction_status == ^TransactionStatus.sale_complete() and
          ((^is_credit_sale == false and t.sales_type == ^SaleType.counter_sale()) or
             (^is_credit_sale == true and t.sales_type == ^SaleType.credit_sale())),
      update: [
        set: [
          updated_by: ^updated_by,
          updated_at: ^DateTime.utc_now(),
          transaction_status: ^TransactionStatus.sale_revert()
        ]
      ]
    )
    |> Repo.update_all([])
    |> case do
      {rows, nil} when rows == 0 ->
        {:error, "All items may already reverted for this transaction or transaction id invalid."}

      {rows, nil} when rows > 0 ->
        {:ok, true}
    end
  end

  defp get_transaction_object(customer_id, user_id) do
    transaction_id = TransactionsHelper.generate_transation_id()

    %{
      "transactions_id" => transaction_id,
      "discount_on_items_price" => 0,
      "discount_on_total_price" => 0,
      "tax_price" => 0,
      "tax_percentage" => "0%",
      "bill_price" => 0,
      "net_price" => 0,
      "paid_price" => 0,
      "transaction_status" => TransactionStatus.sale_pending(),
      "sale_date" => DateTime.utc_now(),
      "sales_type" => SaleType.counter_sale(),
      "is_active" => true,
      "customer_id" => customer_id,
      "created_by" => user_id,
      "updated_by" => user_id
    }
  end
end
