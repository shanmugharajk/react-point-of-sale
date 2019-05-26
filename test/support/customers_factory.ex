defmodule EposWeb.CustomersFactory do
  alias Epos.Customers

  @shan %{
    "id" => "shan",
    "name" => "shan",
    "mobile" => "1234567890",
    "description" => "test customer",
    "address" => "test address",
    "email" => "mail@mail.com",
    "active" => true,
    "updated_by" => "shan",
    "created_by" => "shan"
  }

  def create_new_customer,
    do:
      with(
        {:ok, _new_customer} <- Customers.create_customer(@shan),
        do: @shan
      )

  def customer_request_payload, do: @shan
end
