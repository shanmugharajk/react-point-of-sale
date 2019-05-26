defmodule Epos.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users, primary_key: false) do
      add(:users_id, :string, primary_key: true)
      add(:username, :string, null: false)
      add(:password_hash, :string, null: false)
      add(:email, :string)
      add(:address, :string, size: 500)
      add(:mobile, :string, null: false)
      add(:role, :string, null: false)
      # add(:role, {:array, :string}, null: false)
      add(:active, :boolean, default: true)

      add(
        :created_by,
        references(:users, column: :users_id, type: :string),
        null: true
      )

      add(
        :updated_by,
        references(:users, column: :users_id, type: :string),
        null: true
      )

      timestamps()
    end
  end
end

# References
# https://stackoverflow.com/questions/33065318/how-to-store-array-with-ecto-using-postgres
# https://hexdocs.pm/ecto/Ecto.Schema.html
