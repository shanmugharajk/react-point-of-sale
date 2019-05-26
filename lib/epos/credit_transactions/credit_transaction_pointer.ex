defmodule Epos.CreditTransactions.CreditTransactionPointer do
  use Ecto.Schema
  import Ecto.Changeset

  alias Epos.Customers.Customer
  alias Epos.CreditTransactions.CreditTransactionPointer

  @primary_key false
  @timestamps_opts [type: :utc_datetime, usec: true]

  schema "credit_transactions_pointer" do
    field(:customer_id, :string, primary_key: true)
    field(:seq_pointer, :integer, null: false)
    field(:balance_price, Money.Ecto.Type, null: false)
    field(:created_by, :string, null: false)
    field(:updated_by, :string, null: false)

    belongs_to(:customers, Customer,
      foreign_key: :customer_id,
      references: :customers_id,
      define_field: false
    )

    timestamps()
  end

  @required_fields [
    :customer_id,
    :seq_pointer,
    :balance_price,
    :created_by,
    :updated_by
  ]

  def changeset(%CreditTransactionPointer{} = credit_transaction_pointer, attrs) do
    credit_transaction_pointer
    |> cast(attrs, @required_fields)
    |> validate_required(@required_fields)
  end
end
