defmodule Epos.Repo.Migrations.CreateProductType do
  use Ecto.Migration

  def change do
    create table(:product_types, primary_key: false) do
      add(:product_types_id, :string, primary_key: true)
      add(:description, :string, size: 500, null: false)

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
