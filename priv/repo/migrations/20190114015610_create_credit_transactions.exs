defmodule Epos.Repo.Migrations.CreateCreditTransactions do
  use Ecto.Migration

  def change do
    create table(:credit_transactions) do
      add(
        :customer_id,
        references(
          :customers,
          column: :customers_id,
          type: :string,
          on_delete: :nothing,
          on_update: :update_all,
          null: false
        )
      )

      add(
        :transaction_id,
        references(:transactions,
          column: :transactions_id,
          type: :bigint,
          primary_key: :transactions_id,
          on_delete: :nothing,
          on_update: :update_all,
          null: true
        )
      )

      add(:bill_price, :bigint, null: false)
      add(:paid_price, :bigint, null: false)
      add(:balance_price, :bigint, null: false)
      add(:total_debt_price, :bigint, null: false)
      add(:credit_transaction_type, :string, null: false)
      add(:paid_date, :utc_datetime, null: false)

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
