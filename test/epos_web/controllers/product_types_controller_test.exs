defmodule EposWeb.ProductTypesControllerTest do
  use EposWeb.SuperAdminTokenCase

  alias EposWeb.ProductsFactory
  alias Epos.Products

  describe "api/V1/product-types" do
    test "GET product-types/ [Empty case]", %{conn: conn} do
      conn = get(conn, Routes.product_types_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end

    test "POST product-types/", %{conn: conn} do
      %{resp_body: body, status: status} =
        post(
          conn,
          Routes.product_types_path(conn, :create),
          ProductsFactory.product_type_request_payload()
        )

      id =
        body
        |> Jason.decode!()
        |> Map.get("data")
        |> get_in(["id"])

      {:ok, record} = Products.get_product_type(id)

      assert 201 == status
      assert record.description == ProductsFactory.product_type_request_payload()["description"]
    end

    test "GET product-types/ [One record]", %{conn: conn} do
      new_product_type = ProductsFactory.create_new_product_type()
      %{resp_body: body, status: status} = get(conn, Routes.product_types_path(conn, :index))

      response =
        body
        |> Jason.decode!()
        |> Map.get("data")
        |> List.first()
        |> Map.drop(["created_at", "updated_at"])

      assert status == 200

      assert response == new_product_type
    end

    test "GET product-types/paper", %{conn: conn} do
      new_product_type = ProductsFactory.create_new_product_type()
      id = new_product_type["id"]

      %{resp_body: body, status: status} = get(conn, Routes.product_types_path(conn, :show, id))

      response =
        body
        |> Jason.decode!()
        |> Map.get("data")
        |> Map.drop(["created_at", "updated_at"])

      assert status == 200

      assert response == new_product_type
    end

    test "GET product-types/no-record [When no record]", %{conn: conn} do
      id = "no-record"
      conn = get(conn, Routes.product_types_path(conn, :show, id))
      assert json_response(conn, 404) == %{"errors" => %{"detail" => "No records"}}
    end

    test "DELETE /product-types/paper", %{conn: conn} do
      new_product_type = ProductsFactory.create_new_product_type()

      %{resp_body: body, status: status} =
        conn
        |> delete(Routes.product_types_path(conn, :delete, new_product_type["id"]))

      assert "" == body
      assert 204 == status

      with {:error, error} <- Products.get_product_type(new_product_type["id"]) do
        assert error == "No records"
      end
    end

    test "PUT /product-types/paper", %{conn: conn} do
      new_product_type = ProductsFactory.create_new_product_type()
      id = new_product_type["id"]

      data_to_update =
        new_product_type
        |> Map.put("description", "changed")

      %{resp_body: _body, status: status} =
        put(
          conn,
          Routes.product_types_path(conn, :update, id),
          data_to_update
        )

      assert 200 == status

      with {:ok, data_after_update} <- Products.get_product_type(id) do
        assert data_after_update.description == data_to_update["description"]
      end
    end
  end
end
