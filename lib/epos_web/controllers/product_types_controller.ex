defmodule EposWeb.ProductTypesController do
  use EposWeb, :controller

  import EposWeb.Helpers, only: [current_userid: 1]
  import EposWeb.Helpers.ConnHelper, only: [get_pagination_detail: 1]

  alias Epos.Products
  alias Plug.Conn

  action_fallback EposWeb.FallbackController

  def index(conn, _params) do
    {page_number, page_size} = get_pagination_detail(conn)
    product_types = Products.list_product_types(page_number, page_size)
    render(conn, "index.json", product_types: product_types)
  end

  def search(conn, %{"id" => id}) do
    {page_number, page_size} = get_pagination_detail(conn)

    product_types = Products.search_product_type_by_id(id, page_number, page_size)
    render(conn, "index.json", product_types: product_types)
  end

  def create(conn, params) do
    product_type =
      params
      |> Map.put("created_by", current_userid(conn))
      |> Map.put("updated_by", current_userid(conn))

    with {:ok, product_type} <- Products.create_product_type(product_type) do
      conn
      |> Conn.put_status(201)
      |> render("show.json", product_type: product_type)
    end
  end

  def update(conn, params) do
    with {:ok, product_type} <- Products.get_product_type(params["id"]),
         {:ok, product_type} <-
           Products.update_product_type(
             product_type,
             params |> Map.put("updated_by", current_userid(conn))
           ) do
      render(conn, "show.json", product_type: product_type)
    end
  end

  def show(conn, %{"id" => id}) do
    with {:ok, product_type} <- Products.get_product_type(id) do
      render(conn, "show.json", product_type: product_type)
    end
  end

  def delete(conn, %{"id" => id}) do
    with {:ok, product_type} <- Products.get_product_type(id),
         {:ok, _} <- Products.delete_product_type(product_type) do
      conn
      |> Conn.put_status(204)
      |> Conn.send_resp(:no_content, "")
    end
  end
end
