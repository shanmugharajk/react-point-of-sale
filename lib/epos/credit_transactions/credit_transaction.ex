defmodule Epos.CreditTransactions.CreditTransaction do
  use Ecto.Schema
  import Ecto.Changeset

  alias Epos.Customers.Customer
  alias Epos.Transactions.Transaction
  alias Epos.CreditTransactions.CreditTransaction

  @timestamps_opts [type: :utc_datetime, usec: true]

  schema "credit_transactions" do
    field(:transaction_id, :integer, null: true)
    field(:customer_id, :string, null: false)
    field(:bill_price, Money.Ecto.Type, null: false)
    field(:paid_price, Money.Ecto.Type, null: false)
    field(:balance_price, Money.Ecto.Type, null: false)
    field(:total_debt_price, Money.Ecto.Type, null: false)
    field(:credit_transaction_type, :string, null: false)
    field(:paid_date, :utc_datetime, null: false)
    field(:created_by, :string, null: false)
    field(:updated_by, :string, null: false)

    belongs_to(:customers, Customer,
      foreign_key: :customer_id,
      references: :customers_id,
      define_field: false
    )

    belongs_to(:transactions, Transaction,
      foreign_key: :transaction_id,
      references: :transactions_id,
      define_field: false
    )

    timestamps()
  end

  @required_fields [
    :customer_id,
    :bill_price,
    :paid_price,
    :balance_price,
    :total_debt_price,
    :credit_transaction_type,
    :paid_date,
    :created_by,
    :updated_by
  ]

  @optional_fields [
    :transaction_id
  ]

  def changeset(%CreditTransaction{} = credit_transaction, attrs) do
    credit_transaction
    |> cast(attrs, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> unique_constraint(:transactions_id, name: :transactions_pkey)
  end
end
