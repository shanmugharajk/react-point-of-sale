defmodule Epos.Repo.Migrations.CreateExpense do
  use Ecto.Migration

  def change do
    create table(:expenses) do
      add(:expense, :bigint, null: false)
      add(:spent_at, :utc_datetime, null: false)
      add(:reason, :string, size: 500, null: false)

      add(
        :spent_by,
        references(:users,
          column: :users_id,
          type: :string,
          null: false
        )
      )

      add(
        :expense_type_id,
        references(:expense_types,
          column: :expense_types_id,
          type: :string,
          on_delete: :nothing,
          on_update: :update_all
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
