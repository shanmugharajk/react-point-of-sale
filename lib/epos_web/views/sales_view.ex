defmodule EposWeb.SalesView do
  use EposWeb, :view
  alias EposWeb.SalesView

  def render("init_transaction.json", %{transaction_id: transaction_id}) do
    %{data: %{transaction_id: transaction_id}}
  end

  def render("update_cart.json", %{transaction_detail: transaction_detail}) do
    %{
      data:
        render_one(transaction_detail, SalesView, "transaction_detail.json",
          as: :transaction_detail
        )
    }
  end

  def render("checkout_counter_sale.json", %{transaction: transaction}) do
    %{data: render_one(transaction, SalesView, "transaction.json", as: :transaction)}
  end

  def render("revert_counter_sale.json", _param) do
    %{data: %{status: "Success"}}
  end

  def render("clone_sale.json", %{transaction_details: transaction_details}) do
    %{
      data:
        render_one(transaction_details, SalesView, "complete_sale_detail.json",
          as: :transaction_details
        )
    }
  end

  def render("checkout_credit_sale.json", %{sale_details: {ct, t}}) do
    %{
      data: %{
        credit_transaction:
          render_one(ct, SalesView, "credit_transaction.json", as: :credit_transaction),
        summary: render_one(t, SalesView, "transaction.json", as: :transaction)
      }
    }
  end

  def render("revert_credit_sale.json", %{credit_transaction: credit_transaction}) do
    %{
      data: %{
        credit_transaction:
          render_one(credit_transaction, SalesView, "credit_transaction.json",
            as: :credit_transaction
          )
      }
    }
  end

  def render("credit_payment.json", %{credit_transaction: credit_transaction}) do
    %{
      data: %{
        credit_transaction:
          render_one(credit_transaction, SalesView, "credit_transaction.json",
            as: :credit_transaction
          )
      }
    }
  end

  # UTILS ============
  def render("complete_sale_detail.json", %{transaction_details: {t, td}}) do
    %{
      transaction_details:
        render_many(td, SalesView, "transaction_detail.json", as: :transaction_detail),
      transaction_summary: render_one(t, SalesView, "transaction.json", as: :transaction)
    }
  end

  def render("credit_transaction.json", %{credit_transaction: ct}) do
    %{
      balance_price: ct.balance_price.amount,
      bill_price: ct.bill_price.amount,
      created_by: ct.created_by,
      credit_transaction_type: ct.credit_transaction_type,
      customer_id: ct.customer_id,
      inserted_at: ct.inserted_at,
      paid_date: ct.paid_date,
      paid_price: ct.paid_price.amount,
      total_debt_price: ct.total_debt_price.amount,
      transaction_id: ct.transaction_id,
      updated_at: ct.updated_at,
      updated_by: ct.updated_by
    }
  end

  def render("transaction_detail.json", %{transaction_detail: transaction_detail}) do
    %{
      cost_price: transaction_detail.cost_price.amount,
      selling_price: transaction_detail.selling_price.amount,
      bill_price: transaction_detail.bill_price.amount,
      discount_price: transaction_detail.discount_price.amount,
      discount_total_price: transaction_detail.discount_total_price.amount,
      net_price: transaction_detail.net_price.amount,
      created_by: transaction_detail.created_by,
      inserted_at: transaction_detail.inserted_at,
      product_id: transaction_detail.product_id,
      qty: transaction_detail.qty,
      transaction_details_id: transaction_detail.transaction_details_id,
      updated_at: transaction_detail.updated_at,
      updated_by: transaction_detail.updated_by
    }
  end

  def render("transaction.json", %{transaction: transaction}) do
    %{
      id: transaction.transactions_id,
      status: transaction.transaction_status,
      discount_on_items_price: transaction.discount_on_items_price.amount,
      discount_on_total_price: transaction.discount_on_total_price.amount,
      tax_price: transaction.tax_price.amount,
      bill_price: transaction.bill_price.amount,
      net_price: transaction.net_price.amount,
      paid_price: transaction.paid_price.amount,
      tax_percentage: transaction.tax_percentage,
      sales_type: transaction.sales_type,
      sale_date: transaction.sale_date,
      is_active: transaction.is_active,
      customer_id: transaction.customer_id,
      created_by: transaction.created_by,
      updated_by: transaction.updated_by
    }
  end
end
