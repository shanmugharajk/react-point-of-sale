defmodule EposWeb.VendorsControllerTest do
  use EposWeb.SuperAdminTokenCase

  alias Epos.Vendors
  alias EposWeb.VendorsFactory

  describe "api/V1/vendors" do
    test "GET vendors/ [Empty case]", %{conn: conn} do
      conn = get(conn, Routes.vendors_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end

    test "POST vendors/", %{conn: conn} do
      %{resp_body: body, status: status} =
        post(
          conn,
          Routes.vendors_path(conn, :create),
          VendorsFactory.vendor_request_payload()
        )

      id =
        body
        |> Jason.decode!()
        |> Map.get("data")
        |> get_in(["id"])

      {:ok, record} = Vendors.get_vendor(id)

      assert 201 == status
      assert record.description == VendorsFactory.vendor_request_payload()["description"]
    end
  end

  test "GET vendors/ [One record]", %{conn: conn} do
    new_vendor = VendorsFactory.create_new_vendor()
    %{resp_body: body, status: status} = get(conn, Routes.vendors_path(conn, :index))

    response =
      body
      |> Jason.decode!()
      |> Map.get("data")
      |> List.first()
      |> Map.drop(["created_at", "updated_at"])

    assert status == 200

    assert response == new_vendor
  end

  test "GET vendors/shan", %{conn: conn} do
    new_vendor = VendorsFactory.create_new_vendor()
    id = new_vendor["id"]

    %{resp_body: body, status: status} = get(conn, Routes.vendors_path(conn, :show, id))

    response =
      body
      |> Jason.decode!()
      |> Map.get("data")
      |> Map.drop(["created_at", "updated_at"])

    assert status == 200

    assert response == new_vendor
  end

  test "GET vendors/no-record [When no record]", %{conn: conn} do
    id = "no-record"
    conn = get(conn, Routes.vendors_path(conn, :show, id))
    assert json_response(conn, 404) == %{"errors" => %{"detail" => "No records"}}
  end

  test "DELETE /vendors/shan", %{conn: conn} do
    new_vendor = VendorsFactory.create_new_vendor()

    %{resp_body: body, status: status} =
      conn
      |> delete(Routes.vendors_path(conn, :delete, new_vendor["id"]))

    assert "" == body
    assert 204 == status

    with {:error, error} <- Vendors.get_vendor(new_vendor["id"]) do
      assert error == "No records"
    end
  end

  test "DELETE /vendors/no-record", %{conn: conn} do
    conn = delete(conn, Routes.vendors_path(conn, :delete, "no-record"))
    assert json_response(conn, 404) == %{"errors" => %{"detail" => "No records"}}
  end

  test "PUT /vendors/maintenance", %{conn: conn} do
    new_vendor = VendorsFactory.create_new_vendor()
    id = new_vendor["id"]

    data_to_update =
      new_vendor
      |> Map.put("description", "changed")

    %{resp_body: _body, status: status} =
      put(
        conn,
        Routes.vendors_path(conn, :update, id),
        data_to_update
      )

    assert 200 == status

    with {:ok, data_after_update} <- Vendors.get_vendor(id) do
      assert data_after_update.description == data_to_update["description"]
    end
  end
end
