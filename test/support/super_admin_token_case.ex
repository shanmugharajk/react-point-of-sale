defmodule EposWeb.SuperAdminTokenCase do
  use ExUnit.CaseTemplate

  alias Plug.Conn

  using do
    quote do
      # Import conveniences for testing with connections
      use Phoenix.ConnTest
      alias EposWeb.Router.Helpers, as: Routes

      # The default endpoint for testing
      @endpoint EposWeb.Endpoint
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Epos.Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Epos.Repo, {:shared, self()})
    end

    EposWeb.UserTokenHelper.create_user(:super_admin)
    {:ok, token} = EposWeb.UserTokenHelper.fetch_jwt_token(:super_admin)

    conn =
      Phoenix.ConnTest.build_conn()
      |> Conn.put_req_header("accept", "application/json")
      |> Conn.put_req_header("authorization", "Bearer #{token}")

    {:ok, %{conn: conn}}
  end
end
