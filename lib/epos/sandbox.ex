defmodule Epos.Sandbox do
  import Ecto.Query, warn: false
  alias Epos.Repo

  alias Epos.{Accounts, Expenses, Transactions}
  alias Epos.Transactions.{TransactionDetail}

  def insert_test_data, do: loop(100)

  def create_user do
    roles = Application.get_env(:epos, Epos.Auth)[:roles]
    role = Map.get(roles, :super_admin)

    user = %{
      "id" => "shan",
      "password" => "shan",
      "username" => "shan",
      "mobile" => "1234567890",
      "role" => role,
      "active" => true,
      "email" => "email@email.com"
    }

    Accounts.create_user(user)
  end

  def create_transaction_detail do
    %{
      "transaction_details_id" => 1_549_421_363_850,
      "product_id" => "A4",
      "qty" => 10,
      "cost_price" => 3000,
      "selling_price" => 3500,
      "discount_price" => 0,
      "discount_total_price" => 0,
      "bill_price" => 35000,
      "net_price" => 35000,
      "created_by" => "shan",
      "updated_by" => "shan"
    }
    |> Transactions.create_transaction_detail()
  end

  def fetch_summary_from_transaction_detail do
    res =
      from(td in TransactionDetail,
        where: td.transaction_details_id == 1_549_421_363_850,
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

  # --------------------------
  # INSERT 100 PRODUCT_TYPES
  # --------------------------
  defp loop(idx) when idx == 0 do
    IO.puts("=== TEST ROWS INSERTED ===")
  end

  defp loop(idx) do
    insert_bulk(idx)
    loop(idx - 1)
  end

  defp insert_bulk(idx) do
    expense_type = %{
      "created_by" => "shan",
      "description" => "Maintenance of machines, ac's etc.",
      "expense_types_id" => "maintenance",
      "updated_by" => "shan"
    }

    expense_type =
      expense_type
      |> Map.put("expense_types_id", "#{idx} - #{expense_type["expense_types_id"]}")

    Expenses.create_expense_type(expense_type)
  end
end
