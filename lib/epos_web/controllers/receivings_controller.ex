defmodule EposWeb.ReceivingsController do
  use EposWeb, :controller

  alias Plug.Conn
  alias Epos.Stocks

  import EposWeb.Helpers.ConnHelper, only: [get_pagination_detail: 1]
  import EposWeb.Helpers, only: [current_userid: 1]

  action_fallback EposWeb.FallbackController

  def index(conn, _params) do
    {page_number, page_size} = get_pagination_detail(conn)
    receivings = Stocks.list_receivings(page_number, page_size)
    render(conn, "index.json", receivings: receivings)
  end

  def create(conn, params) do
    receiving =
      params
      |> Map.put("created_by", current_userid(conn))
      |> Map.put("updated_by", current_userid(conn))

    with {:ok, receiving} <- Stocks.add_receiving(receiving) do
      conn
      |> Conn.put_status(201)
      |> render("show.json", receiving: receiving)
    end
  end

  def update(conn, params) do
    receiving =
      params
      |> Map.put("updated_by", current_userid(conn))

    with {:ok, receiving} <- Stocks.update_receiving(receiving) do
      render(conn, "show.json", receiving: receiving)
    end
  end

  def show(conn, %{"id" => id}) do
    with {:ok, receiving} <- Stocks.get_receiving(id) do
      render(conn, "show.json", receiving: receiving)
    end
  end

  def delete(conn, _params) do
    id = conn.params["id"]
    updated_by = current_userid(conn)

    with {:ok, _} <- Stocks.delete_receiving(id, updated_by) do
      Conn.send_resp(conn, 204, "")
    end
  end
end
