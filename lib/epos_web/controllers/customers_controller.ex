defmodule EposWeb.CustomersController do
  use EposWeb, :controller

  alias Epos.Customers
  alias Plug.Conn

  import EposWeb.Helpers, only: [current_userid: 1]
  import EposWeb.Helpers.ConnHelper, only: [get_pagination_detail: 1]

  action_fallback EposWeb.FallbackController

  def index(conn, _params) do
    {page_number, page_size} = get_pagination_detail(conn)
    customers = Customers.list_customers(page_number, page_size)
    render(conn, "index.json", customers: customers)
  end

  def create(conn, params) do
    customer =
      params
      |> Map.put("created_by", current_userid(conn))
      |> Map.put("updated_by", current_userid(conn))
      |> Map.put("active", true)

    with {:ok, {:ok, customer}} <- Customers.create_customer(customer) do
      conn
      |> Conn.put_status(201)
      |> render("show.json", customer: customer)
    end
  end

  def update(conn, params) do
    with {:ok, customer} <- Customers.get_customer(params["id"]),
         {:ok, customer} <-
           Customers.update_customer(
             customer,
             params |> Map.put("updated_by", current_userid(conn))
           ) do
      render(conn, "show.json", customer: customer)
    end
  end

  def show(conn, %{"id" => id}) do
    with {:ok, customer} <- Customers.get_customer(id) do
      render(conn, "show.json", customer: customer)
    end
  end
end
