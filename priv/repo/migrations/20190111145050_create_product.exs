defmodule Epos.Repo.Migrations.CreateProduct do
  use Ecto.Migration

  def change do
    create table(:products, primary_key: false) do
      add(:products_id, :string, primary_key: true)
      add(:name, :string, max: 500, null: false)
      add(:description, :string, max: 500)
      add(:cost_price, :bigint, null: false)
      add(:selling_price, :bigint, null: false)

      add(
        :product_type_id,
        references(
          :product_types,
          column: :product_types_id,
          type: :string,
          on_delete: :nothing,
          on_update: :update_all,
          null: false
        )
      )

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
