defmodule EposWeb.VendorsController do
  use EposWeb, :controller

  alias Epos.Vendors
  alias Plug.Conn

  import EposWeb.Helpers, only: [current_userid: 1]
  import EposWeb.Helpers.ConnHelper, only: [get_pagination_detail: 1]

  action_fallback EposWeb.FallbackController

  def index(conn, _params) do
    {page_number, page_size} = get_pagination_detail(conn)
    vendors = Vendors.list_vendors(page_number, page_size)
    render(conn, "index.json", vendors: vendors)
  end

  def create(conn, params) do
    vendor =
      params
      |> Map.put("created_by", current_userid(conn))
      |> Map.put("updated_by", current_userid(conn))
      |> Map.put("active", true)

    with {:ok, vendor} <- Vendors.create_vendor(vendor) do
      conn
      |> Conn.put_status(201)
      |> render("show.json", vendor: vendor)
    end
  end

  def update(conn, params) do
    with {:ok, vendor} <- Vendors.get_vendor(params["id"]),
         {:ok, vendor} <-
           Vendors.update_vendor(
             vendor,
             params |> Map.put("updated_by", current_userid(conn))
           ) do
      render(conn, "show.json", vendor: vendor)
    end
  end

  def show(conn, %{"id" => id}) do
    with {:ok, vendor} <- Vendors.get_vendor(id) do
      render(conn, "show.json", vendor: vendor)
    end
  end

  def delete(conn, %{"id" => id}) do
    with {:ok, vendor} <- Vendors.get_vendor(id),
         {:ok, _} <- Vendors.delete_vendor(vendor) do
      conn
      |> Conn.put_status(204)
      |> Conn.send_resp(:no_content, "")
    end
  end
end
