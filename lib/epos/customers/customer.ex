defmodule Epos.Customers.Customer do
  use Ecto.Schema
  import Ecto.Changeset

  alias Epos.Customers.Customer

  @primary_key {:customers_id, :string, []}
  @derive {Phoenix.Param, key: :customers_id}
  @timestamps_opts [type: :utc_datetime, usec: true]

  schema "customers" do
    field(:name, :string)
    field(:description, :string)
    field(:address, :string)
    field(:mobile, :string)
    field(:email, :string)
    field(:created_by, :string)
    field(:updated_by, :string)
    field(:active, :boolean)

    timestamps()
  end

  @required_fields [:customers_id, :name, :mobile, :created_by, :updated_by, :active]
  @optional_fields [:description, :address, :email]

  def changeset(%Customer{} = customer, attrs) do
    customer
    |> cast(attrs, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> validate_length(:mobile, is: 10)
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:customers_id, name: :customers_pkey)
  end
end
