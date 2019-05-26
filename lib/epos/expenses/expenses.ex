defmodule Epos.Expenses do
  import Ecto.Query, warn: false
  alias Epos.Repo

  alias Epos.Expenses.{Expense, ExpenseType}

  # --------------
  # EXPENSE TYPE
  # ---------------
  def list_expense_types, do: Repo.all(ExpenseType)

  def list_expense_types(page_number, page_size),
    do: Repo.paginate(ExpenseType, page_number, page_size)

  def get_expense_type(id) do
    case Repo.get_by(ExpenseType, expense_types_id: id) do
      nil -> {:error, "No records"}
      expense_type -> {:ok, expense_type}
    end
  end

  def create_expense_type(attrs) do
    data =
      attrs
      |> Map.put("expense_types_id", attrs["id"])

    %ExpenseType{}
    |> ExpenseType.changeset(data)
    |> Repo.insert()
  end

  def update_expense_type(expense_type, attrs) do
    expense_type
    |> ExpenseType.changeset(attrs)
    |> Repo.update()
  end

  def update_expense_type_by_id(id, attrs) do
    with {:ok, expense_type} <- get_expense_type(id) do
      expense_type
      |> ExpenseType.changeset(attrs)
      |> Repo.update()
    end
  end

  def delete_expense_type(expense_type), do: Repo.delete(expense_type)

  # --------------
  # Expense
  # ---------------
  def list_expenses, do: Repo.all(Expense)

  def list_expenses(page_number, page_size),
    do: Repo.paginate(Expense, page_number, page_size)

  def get_expense(id) do
    case Repo.get_by(Expense, id: id) do
      nil -> {:error, "No records"}
      expense -> {:ok, expense}
    end
  end

  def create_expense(attrs) do
    data =
      attrs
      |> Map.put("expenses_id", attrs["id"])

    %Expense{}
    |> Expense.changeset(data)
    |> Repo.insert()
  end

  def update_expense(expense, attrs) do
    expense
    |> Expense.changeset(attrs)
    |> Repo.update()
  end

  def update_expenses_by_id(id, atrrs) do
    with {:ok, expense} <- get_expense(id) do
      expense
      |> Expense.changeset(atrrs)
      |> Repo.update()
    end
  end

  def delete_expense(expense), do: Repo.delete(expense)
end
