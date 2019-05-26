defmodule Epos.Stocks.Stock do
  use Ecto.Schema
  import Ecto.Changeset
  alias Epos.Stocks.Stock
  alias Epos.Products.Product

  @primary_key {:stocks_id, :string, []}
  @derive {Phoenix.Param, key: :stocks_id}
  @timestamps_opts [type: :utc_datetime, usec: true]

  schema "stocks" do
    field(:qty, :integer, null: false)
    field(:created_by, :string)
    field(:updated_by, :string)

    belongs_to(:products, Product,
      foreign_key: :stocks_id,
      references: :products_id,
      define_field: false
    )

    timestamps()
  end

  @required_fields [:stocks_id, :qty, :created_by, :updated_by]

  def changeset(%Stock{} = stock, attrs) do
    stock
    |> cast(attrs, @required_fields)
    |> validate_required(@required_fields)
    |> unique_constraint(:stocks_id, name: :stocks_pkey)
    |> foreign_key_constraint(:products_id, name: :stocks_stocks_id_fkey)
  end
end
