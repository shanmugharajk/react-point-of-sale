defmodule EposWeb.ExpensesController do
  use EposWeb, :controller

  import EposWeb.Helpers, only: [current_userid: 1]
  import EposWeb.Helpers.ConnHelper, only: [get_pagination_detail: 1]

  alias Epos.Expenses
  alias Plug.Conn

  action_fallback EposWeb.FallbackController

  def index(conn, _params) do
    {page_number, page_size} = get_pagination_detail(conn)
    expenses = Expenses.list_expenses(page_number, page_size)
    render(conn, "index.json", expenses: expenses)
  end

  def create(conn, params) do
    expense =
      params
      |> Map.put("created_by", current_userid(conn))
      |> Map.put("updated_by", current_userid(conn))
      |> Map.put("spent_by", current_userid(conn))

    with {:ok, expense} <- Expenses.create_expense(expense) do
      conn
      |> Conn.put_status(201)
      |> render("show.json", expense: expense)
    end
  end

  def update(conn, params) do
    with {:ok, expense} <- Expenses.get_expense(params["id"]),
         {:ok, expense} <-
           Expenses.update_expense(
             expense,
             params |> Map.put("updated_by", current_userid(conn))
           ) do
      render(conn, "show.json", expense: expense)
    end
  end

  def show(conn, %{"id" => id}) do
    with {:ok, expense} <- Expenses.get_expense(id) do
      render(conn, "show.json", expense: expense)
    end
  end

  def delete(conn, %{"id" => id}) do
    with {:ok, expense} <- Expenses.get_expense(id),
         {:ok, _} <- Expenses.delete_expense(expense) do
      conn
      |> Conn.put_status(204)
      |> Conn.send_resp(:no_content, "")
    end
  end
end
