defmodule EposWeb.ExpenseTypesController do
  use EposWeb, :controller

  import EposWeb.Helpers, only: [current_userid: 1]
  import EposWeb.Helpers.ConnHelper, only: [get_pagination_detail: 1]

  alias Epos.Expenses
  alias Plug.Conn

  action_fallback EposWeb.FallbackController

  def index(conn, _params) do
    {page_number, page_size} = get_pagination_detail(conn)
    expense_types = Expenses.list_expense_types(page_number, page_size)
    render(conn, "index.json", expense_types: expense_types)
  end

  def create(conn, params) do
    expense_type =
      params
      |> Map.put("created_by", current_userid(conn))
      |> Map.put("updated_by", current_userid(conn))

    with {:ok, expense_type} <- Expenses.create_expense_type(expense_type) do
      conn
      |> Conn.put_status(201)
      |> render("show.json", expense_type: expense_type)
    end
  end

  def update(conn, params) do
    with {:ok, expense_type} <- Expenses.get_expense_type(params["id"]),
         {:ok, expense_type} <-
           Expenses.update_expense_type(
             expense_type,
             params |> Map.put("updated_by", current_userid(conn))
           ) do
      render(conn, "show.json", expense_type: expense_type)
    end
  end

  def show(conn, %{"id" => id}) do
    with {:ok, expense_type} <- Expenses.get_expense_type(id) do
      render(conn, "show.json", expense_type: expense_type)
    end
  end

  def delete(conn, %{"id" => id}) do
    with {:ok, expense_type} <- Expenses.get_expense_type(id),
         {:ok, _} <- Expenses.delete_expense_type(expense_type) do
      conn
      |> Conn.put_status(204)
      |> Conn.send_resp(:no_content, "")
    end
  end
end
