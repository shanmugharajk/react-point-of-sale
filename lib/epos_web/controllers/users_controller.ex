defmodule EposWeb.UsersController do
  use EposWeb, :controller

  alias Epos.Accounts
  alias Plug.Conn

  import EposWeb.Helpers, only: [current_userid: 1]
  import EposWeb.Helpers.ConnHelper, only: [get_pagination_detail: 1]

  action_fallback EposWeb.FallbackController

  def index(conn, _params) do
    {page_number, page_size} = get_pagination_detail(conn)
    users = Accounts.list_users(page_number, page_size)
    render(conn, "index.json", users: users)
  end

  def create(conn, params) do
    user =
      params
      |> Map.put("active", true)

    with {:ok, user} <- Accounts.create_user(user) do
      conn
      |> Conn.put_status(201)
      |> render("show.json", user: user)
    end
  end

  def update(conn, params) do
    with {:ok, user} <- Accounts.get_user(params["id"]),
         {:ok, user} <-
           Accounts.update_user(
             user,
             params |> Map.put("updated_by", current_userid(conn))
           ) do
      render(conn, "show.json", user: user)
    end
  end

  def show(conn, %{"id" => id}) do
    with {:ok, user} <- Accounts.get_user(id) do
      render(conn, "show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    with {:ok, _} <- check_the_delete_request_is_for_self(conn, id),
         {:ok, user} <- Accounts.get_user(id),
         {:ok, _} <- Accounts.delete_user(user) do
      conn
      |> Conn.put_status(204)
      |> Conn.send_resp(:no_content, "")
    end
  end

  defp check_the_delete_request_is_for_self(conn, id) do
    with {:ok, user} <- Guardian.Plug.current_resource(conn) do
      if user.users_id == id,
        do: {:error, "Can't delete the user who currently logged in."},
        else: {:ok, "success"}
    else
      _ ->
        {:error, "You have no rights to do this operation"}
    end
  end
end
