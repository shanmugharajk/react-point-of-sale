defmodule Epos.CreditTransactions do
  import Ecto.Query, warn: false
  alias Epos.Repo

  alias Epos.CreditTransactions.{CreditTransactionPointer, CreditTransaction}
  alias Epos.Customers.Customer

  def save_transactions(info) do
    with {:ok, ctp} <- get_pointer(info["customer_id"]),
         {:ok, last_ct} <- get_credit_transaction(ctp.seq_pointer),
         {:ok, ct} <- do_save_transactions(last_ct, info),
         {:ok, true} <- update_credit_transaction_pointer(ct) do
      {:ok, ct}
    else
      {:error, error} -> {:error, error}
      error -> {:error, error}
    end
  end

  defp do_save_transactions(last_ct, to_update) do
    %{
      "transaction_id" => to_update["transaction_id"],
      "customer_id" => to_update["customer_id"],
      "bill_price" => to_update["bill_price"].amount,
      "paid_price" => to_update["paid_price"].amount,
      "balance_price" => to_update["balance_price"].amount,
      "updated_by" => to_update["updated_by"],
      "created_by" => to_update["updated_by"],
      "updated_at" => DateTime.utc_now(),
      "created_at" => DateTime.utc_now(),
      "credit_transaction_type" => to_update["credit_transaction_type"],
      "paid_date" => to_update["paid_date"],
      "total_debt_price" =>
        Money.add(last_ct.total_debt_price, to_update["total_debt_price"]).amount
    }
    |> create_credit_transaction()
  end

  defp get_pointer(id) do
    from(ctp in CreditTransactionPointer,
      join: c in Customer,
      where: c.customers_id == ^id and c.customers_id == ctp.customer_id and c.active == true,
      lock: "FOR UPDATE",
      select: ctp
    )
    |> Repo.one()
    |> case do
      nil -> {:error, "Invalid Customer Id."}
      ctp -> {:ok, ctp}
    end
  end

  defp get_credit_transaction(id) do
    case Repo.get_by(CreditTransaction, id: id) do
      nil -> {:error, "Unbale to fetch the credit transaction details."}
      ct -> {:ok, ct}
    end
  end

  def create_credit_transaction(info) do
    %CreditTransaction{}
    |> CreditTransaction.changeset(info)
    |> Repo.insert()
  end

  def create_credit_transaction_pointer(info) do
    %CreditTransactionPointer{}
    |> CreditTransactionPointer.changeset(info)
    |> Repo.insert()
  end

  def update_credit_transaction_pointer(info) do
    from(c in CreditTransactionPointer,
      where: c.customer_id == ^info.customer_id,
      update: [
        set: [
          seq_pointer: ^info.id,
          updated_by: ^info.updated_by,
          balance_price: ^info.balance_price.amount,
          updated_at: ^DateTime.utc_now()
        ]
      ]
    )
    |> Repo.update_all([])
    |> case do
      {1, nil} -> {:ok, true}
      _ -> {:error, "Failed to update transaction pointer."}
    end
  end
end
