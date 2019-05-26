defmodule EposWeb.SalesController do
  use EposWeb, :controller

  alias Epos.CreditTransactions.CreditTransactionType
  alias Epos.Sales.{SaleType}
  alias Epos.{Transactions, Sales}
  alias Plug.Conn

  import EposWeb.Helpers, only: [current_userid: 1]

  action_fallback EposWeb.FallbackController

  def init_transaction(conn, _params) do
    customer_id = conn.params["customer_id"]
    user_id = current_userid(conn)

    with {:ok, transaction_id} <- Transactions.init_transaction(customer_id, user_id) do
      render(conn, "init_transaction.json", transaction_id: transaction_id)
    end
  end

  def update_cart(conn, params) do
    cart_info =
      params
      |> Map.put("created_by", current_userid(conn))
      |> Map.put("updated_by", current_userid(conn))
      |> Map.put("transaction_details_id", params["transaction_id"])

    with {:ok, {:ok, td}} <- Sales.update_cart(cart_info) do
      conn
      |> Conn.put_status(201)
      |> render("update_cart.json", transaction_detail: td)
    end
  end

  def empty_cart(conn, _params) do
    with {:ok, _} <- Sales.delete_cart(conn.params["transaction_id"]) do
      Conn.send_resp(conn, 204, "")
    end
  end

  def delete_item_from_cart(conn, _params) do
    transaction_id = conn.params["transaction_id"]
    product_id = conn.params["product_id"]

    with {:ok, _} <- Sales.delete_item_from_cart(transaction_id, product_id) do
      Conn.send_resp(conn, 204, "")
    end
  end

  # COUNTER SALE ======
  def checkout_counter_sale(conn, params) do
    checkout_info =
      params
      |> Map.put("updated_by", current_userid(conn))
      |> Map.put("sale_type", SaleType.counter_sale())

    with {:ok, {:ok, transaction}} <- Sales.counter_sale_checkout(checkout_info) do
      conn
      |> Conn.put_status(201)
      |> render("checkout_counter_sale.json", transaction: transaction)
    end
  end

  def revert_checkout_counter_sale(conn, _params) do
    transaction_id = conn.params["transaction_id"]
    updated_by = current_userid(conn)

    with {:ok, {:ok, true}} <- Sales.revert_counter_sale(transaction_id, updated_by) do
      conn
      |> Conn.put_status(200)
      |> render("revert_counter_sale.json", %{})
    end
  end

  # CLONE PREVIOUS SALE =======
  def clone_sale(conn, _params) do
    transaction_id = conn.params["transaction_id"]
    created_by = current_userid(conn)

    with {:ok, {:ok, {t, td}}} <- Sales.clone_sale(transaction_id, created_by) do
      conn
      |> Conn.put_status(201)
      |> render("clone_sale.json", transaction_details: {t, td})
    end
  end

  # CREDIT SALE ======
  def checkout_credit_sale(conn, params) do
    checkout_info =
      params
      |> Map.put("updated_by", current_userid(conn))
      |> Map.put("sales_type", SaleType.credit_sale())
      |> Map.put("credit_transaction_type", CreditTransactionType.credit_sale_payment())

    with {:ok, {:ok, ct, t}} <- Sales.credit_sale_checkout(checkout_info) do
      conn
      |> Conn.put_status(201)
      |> render("checkout_credit_sale.json", sale_details: {ct, t})
    end
  end

  def revert_checkout_credit_sale(conn, params) do
    checkout_info =
      params
      |> Map.put("updated_by", current_userid(conn))
      |> Map.put("sale_date", DateTime.utc_now())
      |> Map.put("credit_transaction_type", CreditTransactionType.credit_sale_revert_payment())

    with {:ok, {:ok, ct}} <- Sales.revert_credit_sale(checkout_info) do
      conn
      |> Conn.put_status(201)
      |> render("revert_credit_sale.json", credit_transaction: ct)
    end
  end

  def credit_payment(conn, params) do
    balance_price = Money.multiply(Money.new(params["payment_price"]), -1)

    payment_info = %{
      "transaction_id" => nil,
      "customer_id" => params["customer_id"],
      "bill_price" => Money.new(0),
      "paid_price" => Money.new(0),
      "paid_date" => params["paid_date"],
      "balance_price" => balance_price,
      "total_debt_price" => balance_price,
      "updated_by" => current_userid(conn),
      "credit_transaction_type" => CreditTransactionType.credit_payment()
    }

    with {:ok, {:ok, ct}} <- Sales.credit_payment(payment_info) do
      conn
      |> Conn.put_status(201)
      |> render("credit_payment.json", credit_transaction: ct)
    end
  end

  # TODO: Fefactor this later.
  def adjust_payment(conn, params) do
    payment_info = %{
      "transaction_id" => nil,
      "customer_id" => params["customer_id"],
      "bill_price" => Money.new(0),
      "paid_price" => Money.new(0),
      "paid_date" => params["paid_date"],
      "balance_price" => Money.new(params["payment_price"]),
      "total_debt_price" => Money.new(params["payment_price"]),
      "updated_by" => current_userid(conn),
      "credit_transaction_type" => CreditTransactionType.credit_payment_adjustment()
    }

    with {:ok, {:ok, ct}} <- Sales.credit_payment(payment_info) do
      conn
      |> Conn.put_status(201)
      |> render("credit_payment.json", credit_transaction: ct)
    end
  end
end
