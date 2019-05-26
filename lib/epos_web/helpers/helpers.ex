defmodule EposWeb.Helpers do
  def current_userid(conn) do
    with {:ok, user} <- Guardian.Plug.current_resource(conn) do
      user.users_id
    else
      _ -> {:error, "Unable to fetch the user information"}
    end
  end
end
