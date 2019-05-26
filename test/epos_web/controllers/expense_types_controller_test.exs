defmodule EposWeb.ExpenseTypeControllerTest do
  use EposWeb.SuperAdminTokenCase

  alias EposWeb.ExpensesFactory
  alias Epos.Expenses

  describe "api/V1/expense-types" do
    test "GET expense-types/ [Empty case]", %{conn: conn} do
      conn = get(conn, Routes.expense_types_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end

    test "POST expense-types/", %{conn: conn} do
      %{resp_body: body, status: status} =
        post(
          conn,
          Routes.expense_types_path(conn, :create),
          ExpensesFactory.expense_type_request_payload()
        )

      id =
        body
        |> Jason.decode!()
        |> Map.get("data")
        |> get_in(["id"])

      {:ok, record} = Expenses.get_expense_type(id)

      assert 201 == status
      assert record.description == ExpensesFactory.expense_type_request_payload()["description"]
    end

    test "GET expense-types/ [One record]", %{conn: conn} do
      new_expense_type = ExpensesFactory.create_new_expense_type()
      %{resp_body: body, status: status} = get(conn, Routes.expense_types_path(conn, :index))

      response =
        body
        |> Jason.decode!()
        |> Map.get("data")
        |> List.first()
        |> Map.drop(["created_at", "updated_at"])

      assert status == 200

      assert response == new_expense_type
    end

    test "GET expense-types/maintenance", %{conn: conn} do
      new_expense_type = ExpensesFactory.create_new_expense_type()
      id = new_expense_type["id"]

      %{resp_body: body, status: status} = get(conn, Routes.expense_types_path(conn, :show, id))

      response =
        body
        |> Jason.decode!()
        |> Map.get("data")
        |> Map.drop(["created_at", "updated_at"])

      assert status == 200

      assert response == new_expense_type
    end

    test "GET expense-types/no-record [When no record]", %{conn: conn} do
      id = "no-record"
      conn = get(conn, Routes.expense_types_path(conn, :show, id))
      assert json_response(conn, 404) == %{"errors" => %{"detail" => "No records"}}
    end

    test "DELETE /expense-types/maintenance", %{conn: conn} do
      new_expense_type = ExpensesFactory.create_new_expense_type()

      %{resp_body: body, status: status} =
        conn
        |> delete(Routes.expense_types_path(conn, :delete, new_expense_type["id"]))

      assert "" == body
      assert 204 == status

      with {:error, error} <- Expenses.get_expense_type(new_expense_type["id"]) do
        assert error == "No records"
      end
    end

    test "DELETE /expense-types/no-record", %{conn: conn} do
      conn = delete(conn, Routes.expense_types_path(conn, :delete, "no-record"))
      assert json_response(conn, 404) == %{"errors" => %{"detail" => "No records"}}
    end

    test "PUT /expense-types/maintenance", %{conn: conn} do
      new_expense_type = ExpensesFactory.create_new_expense_type()
      id = new_expense_type["id"]

      data_to_update =
        new_expense_type
        |> Map.put("description", "changed")

      %{resp_body: _body, status: status} =
        put(
          conn,
          Routes.expense_types_path(conn, :update, id),
          data_to_update
        )

      assert 200 == status

      with {:ok, data_after_update} <- Expenses.get_expense_type(id) do
        assert data_after_update.description == data_to_update["description"]
      end
    end
  end
end
