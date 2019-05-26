defmodule Epos.Repo.Migrations.Stock do
  use Ecto.Migration

  def change do
    create table(:stocks, primary_key: false) do
      add(
        :stocks_id,
        references(:products,
          column: :products_id,
          type: :string
        ),
        primary_key: true
      )

      add(:qty, :integer, null: false)

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
