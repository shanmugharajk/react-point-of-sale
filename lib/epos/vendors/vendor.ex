defmodule Epos.Vendors.Vendor do
  use Ecto.Schema
  import Ecto.Changeset

  alias Epos.Vendors.Vendor

  @primary_key {:vendors_id, :string, []}
  @derive {Phoenix.Param, key: :vendors_id}
  @timestamps_opts [type: :utc_datetime, usec: true]

  schema "vendors" do
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

  @required_fields [:vendors_id, :name, :mobile, :created_by, :updated_by, :active]
  @optional_fields [:description, :address, :email]

  def changeset(%Vendor{} = vendor, attrs) do
    vendor
    |> cast(attrs, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> validate_length(:mobile, is: 10)
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:vendors_id, name: :vendors_pkey)
  end
end
