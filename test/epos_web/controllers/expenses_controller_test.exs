defmodule EposWeb.ExpensesControllerTest do
  use EposWeb.SuperAdminTokenCase

  alias EposWeb.ExpensesFactory
  alias Epos.Expenses

  setup %{conn: _conn} do
    ExpensesFactory.create_new_expense_type()
  end

  describe "api/V1/expenses" do
    test "GET expenses/ [Empty case]", %{conn: conn} do
      conn = get(conn, Routes.expenses_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end

    test "POST expenses/", %{conn: conn} do
      %{resp_body: body, status: status} =
        post(conn, Routes.expenses_path(conn, :create), ExpensesFactory.expense_request_payload())

      id =
        body
        |> Jason.decode!()
        |> Map.get("data")
        |> get_in(["id"])

      {:ok, record} = Expenses.get_expense(id)

      assert 201 == status
      assert record.reason == ExpensesFactory.expense_request_payload()["reason"]
    end

    test "GET expenses/ [One record]", %{conn: conn} do
      new_product = ExpensesFactory.create_new_expense()
      %{resp_body: body, status: status} = get(conn, Routes.expenses_path(conn, :index))

      response =
        body
        |> Jason.decode!()
        |> Map.get("data")
        |> List.first()
        |> Map.drop(["created_at", "updated_at", "spent_at"])

      assert status == 200

      assert response ==
               new_product
               |> Map.drop(["spent_at"])
    end

    test "GET expenses/no-record [One record]", %{conn: conn} do
      new_product = ExpensesFactory.create_new_expense()
      id = new_product["id"]

      %{resp_body: body, status: status} = get(conn, Routes.expenses_path(conn, :show, id))

      response =
        body
        |> Jason.decode!()
        |> Map.get("data")
        |> Map.drop(["created_at", "updated_at"])
        # FIXME: Figure out why mismatch here?
        |> Map.drop(["spent_at", "spent_at"])

      assert status == 200

      assert response ==
               new_product
               |> Map.delete("spent_at")
    end

    test "GET expenses/no-record [When no record]", %{conn: conn} do
      id = 1000
      conn = get(conn, Routes.expenses_path(conn, :show, id))
      assert json_response(conn, 404) == %{"errors" => %{"detail" => "No records"}}
    end

    test "DELETE /expenses/xerox_service", %{conn: conn} do
      new_product = ExpensesFactory.create_new_expense()

      %{resp_body: body, status: status} =
        conn
        |> delete(Routes.expenses_path(conn, :delete, new_product["id"]))

      assert "" == body
      assert 204 == status

      with {:error, error} <- Expenses.get_expense(new_product["id"]) do
        assert error == "No records"
      end
    end

    test "PUT /expenses/xerox_service", %{conn: conn} do
      new_product = ExpensesFactory.create_new_expense()
      id = new_product["id"]

      data_to_update =
        new_product
        |> Map.put("reason", "changed")

      %{resp_body: _body, status: status} =
        put(
          conn,
          Routes.expenses_path(conn, :update, id),
          data_to_update
        )

      assert 200 == status

      with {:ok, data_after_update} <- Expenses.get_expense(id) do
        assert data_after_update.reason == data_to_update["reason"]
      end
    end
  end
end
