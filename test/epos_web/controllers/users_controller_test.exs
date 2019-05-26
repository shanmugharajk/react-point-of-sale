defmodule EposWeb.UsersControllerTest do
  use EposWeb.ConnCase

  alias Epos.Accounts
  alias Plug.Conn
  alias EposWeb.UserTokenHelper

  setup %{conn: conn} do
    UserTokenHelper.create_user(:super_admin)
    {:ok, token} = UserTokenHelper.fetch_jwt_token(:super_admin)
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
    {:ok, conn: put_req_header(conn, "authorization", "Bearer #{token}")}
  end

  describe "api/V1/users" do
    test "GET users/", %{conn: conn} do
      conn = get(conn, Routes.users_path(conn, :index))
      data = Map.delete(UserTokenHelper.super_admin_user(), "password")
      assert json_response(conn, 200)["data"] == [data]
    end

    test "GET users/shan ", %{conn: conn} do
      conn = get(conn, Routes.users_path(conn, :show, UserTokenHelper.super_admin_user()["id"]))
      data = Map.delete(UserTokenHelper.super_admin_user(), "password")
      assert json_response(conn, 200)["data"] == data
    end

    test "POST users/", %{conn: conn} do
      conn = post(conn, Routes.users_path(conn, :create), UserTokenHelper.basic_user())
      data = Map.delete(UserTokenHelper.basic_user(), "password")
      assert json_response(conn, 201)["data"] == data
    end

    test "POST users/ (create user already present)", %{conn: conn} do
      UserTokenHelper.create_user(:basic_user)
      conn = post(conn, Routes.users_path(conn, :create), UserTokenHelper.basic_user())

      assert json_response(conn, 422) == %{
               "errors" => %{"detail" => %{"users_id" => ["has already been taken"]}}
             }
    end

    test "PUT users/shan ", %{conn: conn} do
      UserTokenHelper.create_user(:admin)
      data_to_update = Map.put(UserTokenHelper.admin_user(), "address", "changed")

      conn =
        put(
          conn,
          Routes.users_path(conn, :update, UserTokenHelper.admin_user()["id"]),
          data_to_update
        )

      with {:ok, data_after_update} <- Accounts.get_user(UserTokenHelper.admin_user()["id"]) do
        assert json_response(conn, 200)["data"]["address"] == data_after_update.address
      end
    end

    test "PUT users/incorrect (Updating user which is not in database", %{conn: conn} do
      UserTokenHelper.create_user(:admin)
      data_to_update = Map.put(UserTokenHelper.admin_user(), "id", "incorrect")

      conn =
        put(
          conn,
          Routes.users_path(conn, :update, data_to_update["id"]),
          data_to_update
        )

      assert json_response(conn, 404) == %{"errors" => %{"detail" => "No records"}}
    end

    test "DEL users/shan", %{conn: conn} do
      UserTokenHelper.create_user(:admin)

      %{resp_body: body, status: status} =
        conn
        |> Conn.put_req_header("content-type", "json")
        |> delete(Routes.users_path(conn, :delete, UserTokenHelper.admin_user()["id"]))

      assert "" == body
      assert 204 == status

      with {:error, error} <- Accounts.get_user(UserTokenHelper.admin_user()["id"]) do
        assert error == "No records"
      end
    end

    test "DEL users/shan (delete user who logged currently logged in)", %{conn: conn} do
      conn =
        conn
        |> Conn.put_req_header("content-type", "json")
        |> delete(Routes.users_path(conn, :delete, UserTokenHelper.super_admin_user()["id"]))

      assert json_response(conn, 404) == %{
               "errors" => %{"detail" => "Can't delete the user who currently logged in."}
             }

      with {:ok, user} <- Accounts.get_user(UserTokenHelper.super_admin_user()["id"]) do
        assert user.address == UserTokenHelper.super_admin_user()["address"]
      end
    end
  end
end
