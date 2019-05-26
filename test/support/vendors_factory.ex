defmodule EposWeb.VendorsFactory do
  alias Epos.Vendors

  @shan %{
    "id" => "shan",
    "name" => "shan",
    "mobile" => "1234567890",
    "description" => "test vendor",
    "address" => "test address",
    "email" => "mail@mail.com",
    "active" => true,
    "updated_by" => "shan",
    "created_by" => "shan"
  }

  def create_new_vendor,
    do:
      with(
        {:ok, _new_vendor} <- Vendors.create_vendor(@shan),
        do: @shan
      )

  def vendor_request_payload, do: @shan
end
