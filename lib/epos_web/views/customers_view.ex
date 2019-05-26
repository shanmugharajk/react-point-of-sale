defmodule EposWeb.CustomersView do
  use EposWeb, :view

  alias EposWeb.CustomersView

  def render("index.json", %{customers: customers}) do
    %{
      data: render_many(customers.data, CustomersView, "customer.json", as: :customer),
      pagination_info: customers.pagination_info
    }
  end

  def render("show.json", %{customer: customer}) do
    %{data: render_one(customer, CustomersView, "customer.json", as: :customer)}
  end

  def render("customer.json", %{customer: customer}) do
    %{
      id: customer.customers_id,
      name: customer.name,
      mobile: customer.mobile,
      description: customer.description,
      address: customer.address,
      email: customer.email,
      active: customer.active,
      created_by: customer.created_by,
      updated_by: customer.updated_by,
      created_at: customer.inserted_at,
      updated_at: customer.updated_at
    }
  end
end
