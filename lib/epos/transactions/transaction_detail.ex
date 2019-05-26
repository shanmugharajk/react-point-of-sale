defmodule Epos.Transactions.TransactionDetail do
  use Ecto.Schema
  import Ecto.Changeset

  alias Epos.Transactions.TransactionDetail
  alias Epos.Transactions.Transaction
  alias Epos.Products.Product

  @primary_key false
  @timestamps_opts [type: :utc_datetime, usec: true]

  schema "transaction_details" do
    field(:transaction_details_id, :integer, primary_key: true)
    field(:product_id, :string, primary_key: true)
    field(:qty, :integer, null: false)
    field(:cost_price, Money.Ecto.Type, null: false)
    field(:selling_price, Money.Ecto.Type, null: false)
    field(:discount_price, Money.Ecto.Type, null: false)
    field(:discount_total_price, Money.Ecto.Type, null: false)
    field(:bill_price, Money.Ecto.Type, null: false)
    field(:net_price, Money.Ecto.Type, null: false)
    field(:is_reverted, :boolean, null: false, default: false)
    field(:created_by, :string)
    field(:updated_by, :string)

    belongs_to(:transactions, Transaction,
      foreign_key: :transaction_details_id,
      references: :transactions_id,
      define_field: false
    )

    belongs_to(:products, Product,
      foreign_key: :product_id,
      references: :products_id,
      define_field: false
    )

    timestamps()
  end

  @required_fields [
    :transaction_details_id,
    :product_id,
    :qty,
    :cost_price,
    :selling_price,
    :discount_price,
    :discount_total_price,
    :bill_price,
    :net_price,
    :created_by,
    :updated_by
  ]

  def changeset(%TransactionDetail{} = transaction_detail, attrs) do
    transaction_detail
    |> cast(attrs, @required_fields)
    |> validate_required(@required_fields)
    |> unique_constraint(:transaction_details_id, name: :transaction_details_pkey)
  end
end
