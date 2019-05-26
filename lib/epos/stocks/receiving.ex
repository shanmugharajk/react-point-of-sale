defmodule Epos.Stocks.Receiving do
  use Ecto.Schema
  import Ecto.Changeset
  alias Epos.Stocks.Receiving
  alias Epos.Products.Product
  alias Epos.Vendors.Vendor

  schema "receivings" do
    field(:vendor_id, :string, null: false)
    field(:product_id, :string, null: false)
    field(:qty, :integer, null: false)
    field(:price, Money.Ecto.Type, null: false)
    field(:received_date, :utc_datetime, null: false)
    field(:created_by, :string)
    field(:updated_by, :string)

    belongs_to(:products, Product,
      foreign_key: :product_id,
      references: :products_id,
      define_field: false
    )

    belongs_to(:vendors, Vendor,
      foreign_key: :vendor_id,
      references: :vendors_id,
      define_field: false
    )

    timestamps()
  end

  @required_fields [
    :vendor_id,
    :product_id,
    :qty,
    :price,
    :received_date,
    :created_by,
    :updated_by
  ]

  def changeset(%Receiving{} = receiving, attrs) do
    receiving
    |> cast(attrs, @required_fields)
    |> validate_required(@required_fields)
    |> unique_constraint(:id, name: :receivings_pkey)
  end
end
