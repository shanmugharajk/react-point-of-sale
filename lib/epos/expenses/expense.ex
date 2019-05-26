defmodule Epos.Expenses.Expense do
  use Ecto.Schema
  import Ecto.Changeset
  alias Epos.Expenses.{Expense, ExpenseType}
  alias Epos.Accounts.User

  @timestamps_opts [type: :utc_datetime, usec: true]
  schema "expenses" do
    field(:expense, Money.Ecto.Type)
    field(:reason, :string)
    field(:spent_at, :utc_datetime)
    field(:created_by, :string)
    field(:updated_by, :string)

    field(:spent_by, :string)
    field(:expense_type_id, :string)

    belongs_to(:expense_types, ExpenseType,
      foreign_key: :expense_type_id,
      references: :expense_types_id,
      define_field: false
    )

    belongs_to(:users, User,
      foreign_key: :spent_by,
      references: :users_id,
      define_field: false
    )

    timestamps()
  end

  @required_fields [
    :expense,
    :reason,
    :spent_at,
    :created_by,
    :updated_by,
    :spent_by,
    :expense_type_id
  ]

  def changeset(%Expense{} = expense, attrs) do
    expense
    |> cast(attrs, @required_fields)
    |> validate_required(@required_fields)
    |> unique_constraint(:id, name: :expenses_pkey)
  end
end
