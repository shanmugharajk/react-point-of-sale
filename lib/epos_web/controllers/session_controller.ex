defmodule EposWeb.SessionController do
  use EposWeb, :controller

  alias Epos.Accounts

  action_fallback EposWeb.FallbackController

  def login(conn, %{"userid" => userid, "password" => password}) do
    case Accounts.auth(userid, password) do
      {:ok, token} ->
        conn |> render("jwt.json", jwt: token)

      _ ->
        {:error, :invalid_credentials}
    end
  end
end
