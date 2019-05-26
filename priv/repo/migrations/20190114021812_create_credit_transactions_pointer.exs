defmodule Epos.Repo.Migrations.CreateCreditTransactionsPointer do
  use Ecto.Migration

  def change do
    create table(:credit_transactions_pointer, primary_key: false) do
      add(
        :customer_id,
        references(:customers,
          column: :customers_id,
          type: :string
        ),
        primary_key: true
      )

      add(:seq_pointer, :integer, null: false)
      add(:balance_price, :bigint, null: false)

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
