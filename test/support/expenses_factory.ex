defmodule EposWeb.ExpensesFactory do
  alias Epos.Expenses

  @maintenance %{
    "created_by" => "shan",
    "description" => "Maintenance of machines, ac's etc.",
    "id" => "maintenance",
    "updated_by" => "shan"
  }

  @xerox_service %{
    "expense" => 3500,
    "reason" => "xerox service",
    # "spent_at" => DateTime.utc_now(),
    "spent_at" => "2019-01-21T05:03:10.201Z",
    "created_by" => "shan",
    "updated_by" => "shan",
    "spent_by" => "shan",
    "expense_type_id" => "maintenance"
  }

  # ------------------------
  # EXPENSE_TYPE
  # ------------------------

  def create_new_expense_type,
    do:
      with(
        {:ok, _new_expense_type} <- Expenses.create_expense_type(@maintenance),
        do: @maintenance
      )

  def expense_type_request_payload, do: @maintenance

  # ------------------------
  # EXPENSE
  # ------------------------

  def create_new_expense,
    do:
      with(
        {:ok, new_expense} <- Expenses.create_expense(@xerox_service),
        do: @xerox_service |> Map.put("id", new_expense.id)
      )

  def expense_request_payload, do: @xerox_service
end
