defmodule Epos.Expenses.ExpenseType do
  use Ecto.Schema
  import Ecto.Changeset
  alias Epos.Expenses.{ExpenseType, Expense}

  @primary_key {:expense_types_id, :string, []}
  @derive {Phoenix.Param, key: :expense_types_id}
  @timestamps_opts [type: :utc_datetime, usec: true]

  schema "expense_types" do
    field(:description, :string)
    field(:created_by, :string)
    field(:updated_by, :string)

    has_many(:expenses, Expense, foreign_key: :id, references: :expense_types_id)

    timestamps()
  end

  @required_fields [:expense_types_id, :description, :created_by, :updated_by]

  def changeset(%ExpenseType{} = expense_type, attrs) do
    expense_type
    |> cast(attrs, @required_fields)
    |> validate_required(@required_fields)
    |> unique_constraint(:expense_types_id, name: :expense_types_pkey)
  end
end
