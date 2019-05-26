defmodule EposWeb.ExpensesView do
  use EposWeb, :view

  alias EposWeb.ExpensesView

  def render("index.json", %{expenses: expenses}) do
    %{
      data: render_many(expenses.data, ExpensesView, "expense.json", as: :expense),
      pagination_info: expenses.pagination_info
    }
  end

  def render("show.json", %{expense: expense}) do
    %{data: render_one(expense, ExpensesView, "expense.json", as: :expense)}
  end

  def render("expense.json", %{expense: expense}) do
    %{
      id: expense.id,
      expense: expense.expense.amount,
      reason: expense.reason,
      spent_at: expense.spent_at,
      spent_by: expense.spent_by,
      expense_type_id: expense.expense_type_id,
      created_by: expense.created_by,
      updated_by: expense.updated_by,
      created_at: expense.inserted_at,
      updated_at: expense.updated_at
    }
  end
end
