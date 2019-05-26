defmodule Epos.Products.ProductType do
  use Ecto.Schema
  import Ecto.Changeset
  alias Epos.Products.{ProductType, Product}

  @primary_key {:product_types_id, :string, []}
  @derive {Phoenix.Param, key: :product_types_id}
  @timestamps_opts [type: :utc_datetime, usec: true]
  schema "product_types" do
    field(:description, :string)
    field(:created_by, :string)
    field(:updated_by, :string)

    has_many(:products, Product, foreign_key: :products_id, references: :product_types_id)

    timestamps()
  end

  @required_fields [:product_types_id, :description, :created_by, :updated_by]

  def changeset(%ProductType{} = product_type, attrs) do
    product_type
    |> cast(attrs, @required_fields)
    |> validate_required(@required_fields)
    |> unique_constraint(:product_types_id, name: :product_types_pkey)
  end
end
