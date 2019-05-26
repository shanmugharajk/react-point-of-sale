defmodule EposWeb.ExpenseTypesView do
  use EposWeb, :view

  alias EposWeb.ExpenseTypesView

  def render("index.json", %{expense_types: expense_types}) do
    %{
      data:
        render_many(expense_types.data, ExpenseTypesView, "expense_type.json", as: :expense_type),
      pagination_info: expense_types.pagination_info
    }
  end

  def render("show.json", %{expense_type: expense_type}) do
    %{data: render_one(expense_type, ExpenseTypesView, "expense_type.json", as: :expense_type)}
  end

  def render("expense_type.json", %{expense_type: expense_type}) do
    %{
      id: expense_type.expense_types_id,
      description: expense_type.description,
      created_by: expense_type.created_by,
      updated_by: expense_type.updated_by,
      created_at: expense_type.inserted_at,
      updated_at: expense_type.updated_at
    }
  end
end
