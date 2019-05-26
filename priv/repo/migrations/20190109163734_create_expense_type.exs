defmodule Epos.Repo.Migrations.CreateExpenseType do
  use Ecto.Migration

  def change do
    create table(:expense_types, primary_key: false) do
      add(:expense_types_id, :string, primary_key: true)
      add(:description, :string, size: 500)

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
