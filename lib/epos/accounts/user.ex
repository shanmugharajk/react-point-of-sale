defmodule Epos.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  alias Epos.Accounts.User

  # import Comeonin.Bcrypt, only: [hashpwsalt: 1]

  @primary_key {:users_id, :string, []}
  @derive {Phoenix.Param, key: :users_id}
  @timestamps_opts [type: :utc_datetime, usec: true]

  schema "users" do
    field(:username, :string)
    field(:password_hash, :string)
    field(:email, :string)
    field(:address, :string)
    field(:mobile, :string)
    field(:role, :string)
    field(:active, :boolean)

    field(:created_by, :string, null: true)
    field(:updated_by, :string, null: true)

    # Virtual fields:
    field :password, :string, virtual: true

    timestamps()
  end

  @required_fields [:users_id, :username, :password, :mobile, :role, :active]
  @optional_fields [:email, :address]

  def changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> validate_length(:mobile, is: 10)
    |> validate_format(:email, ~r/@/)
    |> put_password_hash
    |> unique_constraint(:users_id, name: :users_pkey)
  end

  defp put_password_hash(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: pass}} ->
        # put_change(changeset, :password_hash, hashpwsalt(pass))
        put_change(changeset, :password_hash, pass)

      _ ->
        changeset
    end
  end
end
