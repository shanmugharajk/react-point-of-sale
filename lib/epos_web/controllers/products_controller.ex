defmodule EposWeb.ProductsController do
  use EposWeb, :controller

  import EposWeb.Helpers, only: [current_userid: 1]
  import EposWeb.Helpers.ConnHelper, only: [get_pagination_detail: 1]

  alias Epos.Products
  alias Plug.Conn

  action_fallback EposWeb.FallbackController

  def index(conn, _params) do
    {page_number, page_size} = get_pagination_detail(conn)
    products = Products.list_products(page_number, page_size)
    render(conn, "index.json", products: products)
  end

  def search(conn, %{"id" => id}) do
    {page_number, page_size} = get_pagination_detail(conn)

    products = Products.search_product_by_id(id, page_number, page_size)
    render(conn, "index.json", products: products)
  end

  def create(conn, params) do
    product =
      params
      |> Map.put("created_by", current_userid(conn))
      |> Map.put("updated_by", current_userid(conn))

    with {:ok, product} <- Products.create_product(product) do
      conn
      |> Conn.put_status(201)
      |> render("show.json", product: product)
    end
  end

  def update(conn, params) do
    with {:ok, product} <- Products.get_product(params["id"]),
         {:ok, product} <-
           Products.update_product(
             product,
             params |> Map.put("updated_by", current_userid(conn))
           ) do
      render(conn, "show.json", product: product)
    end
  end

  def show(conn, %{"id" => id}) do
    with {:ok, product} <- Products.get_product(id) do
      render(conn, "show.json", product: product)
    end
  end

  def delete(conn, %{"id" => id}) do
    with {:ok, product} <- Products.get_product(id),
         {:ok, _} <- Products.delete_product(product) do
      conn
      |> Conn.put_status(204)
      |> Conn.send_resp(:no_content, "")
    end
  end
end
