defmodule EposWeb.CustomersControllerTest do
  use EposWeb.SuperAdminTokenCase

  alias Epos.Customers
  alias EposWeb.CustomersFactory

  describe "api/V1/customers" do
    test "GET customers/ [Empty case]", %{conn: conn} do
      conn = get(conn, Routes.customers_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end

    test "POST customers/", %{conn: conn} do
      %{resp_body: body, status: status} =
        post(
          conn,
          Routes.customers_path(conn, :create),
          CustomersFactory.customer_request_payload()
        )

      id =
        body
        |> Jason.decode!()
        |> Map.get("data")
        |> get_in(["id"])

      {:ok, record} = Customers.get_customer(id)

      assert 201 == status
      assert record.description == CustomersFactory.customer_request_payload()["description"]
    end
  end

  test "GET customers/ [One record]", %{conn: conn} do
    new_customer = CustomersFactory.create_new_customer()
    %{resp_body: body, status: status} = get(conn, Routes.customers_path(conn, :index))

    response =
      body
      |> Jason.decode!()
      |> Map.get("data")
      |> List.first()
      |> Map.drop(["created_at", "updated_at"])

    assert status == 200

    assert response == new_customer
  end

  test "GET customers/shan", %{conn: conn} do
    new_customer = CustomersFactory.create_new_customer()
    id = new_customer["id"]

    %{resp_body: body, status: status} = get(conn, Routes.customers_path(conn, :show, id))

    response =
      body
      |> Jason.decode!()
      |> Map.get("data")
      |> Map.drop(["created_at", "updated_at"])

    assert status == 200

    assert response == new_customer
  end

  test "GET customers/no-record [When no record]", %{conn: conn} do
    id = "no-record"
    conn = get(conn, Routes.customers_path(conn, :show, id))
    assert json_response(conn, 404) == %{"errors" => %{"detail" => "No records"}}
  end

  test "PUT /customers/maintenance", %{conn: conn} do
    new_customer = CustomersFactory.create_new_customer()
    id = new_customer["id"]

    data_to_update =
      new_customer
      |> Map.put("description", "changed")

    %{resp_body: _body, status: status} =
      put(
        conn,
        Routes.customers_path(conn, :update, id),
        data_to_update
      )

    assert 200 == status

    with {:ok, data_after_update} <- Customers.get_customer(id) do
      assert data_after_update.description == data_to_update["description"]
    end
  end
end
