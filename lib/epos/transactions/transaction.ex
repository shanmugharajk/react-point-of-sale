defmodule Epos.Transactions.Transaction do
  use Ecto.Schema
  import Ecto.Changeset

  alias Epos.Customers.Customer
  alias Epos.Transactions.Transaction

  @primary_key false
  @timestamps_opts [type: :utc_datetime, usec: true]

  schema "transactions" do
    field(:transactions_id, :integer, primary_key: true)
    field(:transaction_status, :string, primary_key: true)

    field(:discount_on_items_price, Money.Ecto.Type, null: false)
    field(:discount_on_total_price, Money.Ecto.Type, null: false)
    field(:tax_price, Money.Ecto.Type, null: false)
    field(:tax_percentage, :string, null: false)
    field(:bill_price, Money.Ecto.Type, null: false)
    field(:net_price, Money.Ecto.Type, null: false)
    field(:paid_price, Money.Ecto.Type, null: false)
    field(:sales_type, :string, null: false)
    field(:sale_date, :utc_datetime, null: false)
    field(:comments, :string)
    field(:is_active, :boolean, default: true)
    field(:customer_id, :string, null: true)
    field(:created_by, :string)
    field(:updated_by, :string)

    belongs_to(:customers, Customer,
      foreign_key: :customer_id,
      references: :customers_id,
      define_field: false
    )

    timestamps()
  end

  @required_fields [
    :transactions_id,
    :discount_on_items_price,
    :discount_on_total_price,
    :tax_price,
    :tax_percentage,
    :bill_price,
    :net_price,
    :paid_price,
    :transaction_status,
    :sale_date,
    :sales_type,
    :is_active,
    :customer_id,
    :created_by,
    :updated_by
  ]

  @optional_fields [:comments]

  def changeset(%Transaction{} = transaction, attrs) do
    transaction
    |> cast(attrs, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> unique_constraint(:transactions_id, name: :transactions_pkey)
  end
end
