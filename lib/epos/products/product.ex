defmodule Epos.Products.Product do
  use Ecto.Schema
  import Ecto.Changeset
  alias Epos.Products.{ProductType, Product}

  @primary_key {:products_id, :string, []}
  @derive {Phoenix.Param, key: :products_id}
  @timestamps_opts [type: :utc_datetime, usec: true]
  schema "products" do
    field(:name, :string)
    field(:description, :string)
    field(:cost_price, Money.Ecto.Type)
    field(:selling_price, Money.Ecto.Type)
    field(:created_by, :string)
    field(:updated_by, :string)
    field(:product_type_id, :string)

    belongs_to(:product_types, ProductType,
      foreign_key: :product_type_id,
      references: :product_types_id,
      define_field: false
    )

    timestamps()
  end

  @required_fields [
    :products_id,
    :name,
    :product_type_id,
    :description,
    :cost_price,
    :selling_price,
    :created_by,
    :updated_by
  ]

  def changeset(%Product{} = product, attrs) do
    product
    |> cast(attrs, @required_fields)
    |> validate_required(@required_fields)
    |> unique_constraint(:products_id, name: :products_pkey)
  end
end
