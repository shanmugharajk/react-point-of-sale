defmodule EposWeb.ProductsFactory do
  alias Epos.Products

  @paper %{
    "created_by" => "shan",
    "description" => "printings business",
    "id" => "paper",
    "updated_by" => "shan"
  }

  @a4 %{
    "id" => "A4",
    "product_type_id" => "paper",
    "name" => "A4 paper",
    "description" => "A4 paper",
    "cost_price" => 3000,
    "selling_price" => 3500,
    "updated_by" => "shan",
    "created_by" => "shan"
  }

  # ------------------------
  # PRODUCT_TYPE
  # ------------------------

  def create_new_product_type,
    do: with({:ok, _new_product_type} <- Products.create_product_type(@paper), do: @paper)

  def product_type_request_payload, do: @paper

  # ------------------------
  # PRODUCT
  # ------------------------

  def create_new_product, do: with({:ok, _new_product} <- Products.create_product(@a4), do: @a4)

  def product_request_payload, do: @a4
end
