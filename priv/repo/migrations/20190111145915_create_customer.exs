defmodule Epos.Repo.Migrations.CreateCustomer do
  use Ecto.Migration

  def change do
    create table(:customers, primary_key: false) do
      add(:customers_id, :string, max: 10, primary_key: true)
      add(:name, :string, max: 200, null: true)
      add(:description, :string, max: 400)
      add(:address, :string, max: 500)
      add(:mobile, :string, max: 10)
      add(:email, :string, null: true)
      add(:active, :boolean, default: true)

      add(
        :created_by,
        references(:users,
          column: :users_id,
          type: :string,
          null: false
        )
      )

      add(
        :updated_by,
        references(:users,
          column: :users_id,
          type: :string,
          null: false
        )
      )

      timestamps()
    end
  end
end
