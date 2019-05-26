defmodule Epos.Customers do
  import Ecto.Query, warn: false

  alias Epos.Repo
  alias Epos.Customers.Customer
  alias Epos.CreditTransactions
  alias Epos.CreditTransactions.CreditTransactionType

  def list_customers, do: Repo.paginate(Customer)

  def list_customers(page_number, page_size),
    do: Repo.paginate(Customer, page_number, page_size)

  def get_customer(id) do
    case Repo.get_by(Customer, customers_id: id) do
      nil -> {:error, "No records"}
      customer -> {:ok, customer}
    end
  end

  def create_customer(customer_info) do
    customer_id = customer_info["id"]
    created_by = customer_info["created_by"]

    Repo.transaction(fn ->
      with {:ok, c} <- do_create_customer(customer_info),
           {:ok, ct} <- create_credit_transation(customer_id, created_by),
           {:ok, _} <- create_credit_transaction_pointer(ct) do
        {:ok, c}
      else
        {:error, error} -> Repo.rollback(error)
        error -> Repo.rollback(error)
      end
    end)
  end

  defp create_credit_transaction_pointer(info) do
    %{
      "customer_id" => info.customer_id,
      "seq_pointer" => info.id,
      "balance_price" => 0,
      "created_by" => info.created_by,
      "updated_by" => info.updated_by
    }
    |> CreditTransactions.create_credit_transaction_pointer()
  end

  defp create_credit_transation(customer_id, created_by) do
    %{
      "customer_id" => customer_id,
      "paid_price" => 0,
      "bill_price" => 0,
      "balance_price" => 0,
      "total_debt_price" => 0,
      "credit_transaction_type" => CreditTransactionType.record_entry(),
      "paid_date" => DateTime.utc_now(),
      "created_by" => created_by,
      "updated_by" => created_by
    }
    |> CreditTransactions.create_credit_transaction()
  end

  defp do_create_customer(customer_info) do
    data =
      customer_info
      |> Map.put("customers_id", customer_info["id"])

    %Customer{}
    |> Customer.changeset(data)
    |> Repo.insert()
  end

  def update_customer(customer, attrs) do
    customer
    |> Customer.changeset(attrs)
    |> Repo.update()
  end

  def update_customer_by_id(id, attrs) do
    with {:ok, customer} <- get_customer(id) do
      customer
      |> Customer.changeset(attrs)
      |> Repo.update()
    end
  end

  def delete_customer(customer), do: Repo.delete(customer)
end
