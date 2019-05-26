defmodule EposWeb.ProductsControllerTest do
  use EposWeb.SuperAdminTokenCase

  alias EposWeb.ProductsFactory
  alias Epos.Products

  setup %{conn: _conn} do
    ProductsFactory.create_new_product_type()
  end

  describe "api/V1/products" do
    test "GET products/ [Empty case]", %{conn: conn} do
      conn = get(conn, Routes.products_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end

    test "POST products/", %{conn: conn} do
      %{resp_body: body, status: status} =
        post(conn, Routes.products_path(conn, :create), ProductsFactory.product_request_payload())

      id =
        body
        |> Jason.decode!()
        |> Map.get("data")
        |> get_in(["id"])

      {:ok, record} = Products.get_product(id)

      assert 201 == status
      assert record.description == ProductsFactory.product_request_payload()["description"]
    end

    test "GET products/ [One record]", %{conn: conn} do
      new_product = ProductsFactory.create_new_product()
      %{resp_body: body, status: status} = get(conn, Routes.products_path(conn, :index))

      response =
        body
        |> Jason.decode!()
        |> Map.get("data")
        |> List.first()
        |> Map.drop(["created_at", "updated_at"])

      assert status == 200

      assert response == new_product
    end

    test "GET products/paper [One record]", %{conn: conn} do
      new_product = ProductsFactory.create_new_product()
      id = new_product["id"]

      %{resp_body: body, status: status} = get(conn, Routes.products_path(conn, :show, id))

      response =
        body
        |> Jason.decode!()
        |> Map.get("data")
        |> Map.drop(["created_at", "updated_at"])

      assert status == 200

      assert response == new_product
    end

    test "GET products/no-record [When no record]", %{conn: conn} do
      id = "no-record"
      conn = get(conn, Routes.products_path(conn, :show, id))
      assert json_response(conn, 404) == %{"errors" => %{"detail" => "No records"}}
    end

    test "DELETE /products/A4", %{conn: conn} do
      new_product = ProductsFactory.create_new_product()

      %{resp_body: body, status: status} =
        conn
        |> delete(Routes.products_path(conn, :delete, new_product["id"]))

      assert "" == body
      assert 204 == status

      with {:error, error} <- Products.get_product(new_product["id"]) do
        assert error == "No records"
      end
    end

    test "PUT /products/A4", %{conn: conn} do
      new_product = ProductsFactory.create_new_product()
      id = new_product["id"]

      data_to_update =
        new_product
        |> Map.put("description", "changed")

      %{resp_body: _body, status: status} =
        put(
          conn,
          Routes.products_path(conn, :update, id),
          data_to_update
        )

      assert 200 == status

      with {:ok, data_after_update} <- Products.get_product(id) do
        assert data_after_update.description == data_to_update["description"]
      end
    end
  end
end
