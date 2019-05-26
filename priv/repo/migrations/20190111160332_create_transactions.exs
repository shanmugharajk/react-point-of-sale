defmodule Epos.Repo.Migrations.Transactions do
  use Ecto.Migration

  def change do
    create table(:transactions, primary_key: false) do
      add(:transactions_id, :bigint, primary_key: true)
      add(:transaction_status, :string, primary_key: true)
      add(:discount_on_items_price, :bigint, null: false)
      add(:discount_on_total_price, :bigint, null: false)
      add(:tax_price, :bigint, null: false)
      add(:tax_percentage, :string, null: false)
      add(:bill_price, :bigint, null: false)
      # Actual amount which customer needs to pay.
      # => bill_price - (discount_on_items_price + discount_on_total_price) + tax_price
      add(:net_price, :bigint, null: false)

      # This is for split payment which is for credit payment sale type.
      # For anonymous customer this is same sa net_price
      add(:paid_price, :bigint, null: false)
      add(:sale_date, :utc_datetime, null: false)
      add(:sales_type, :string, null: false)
      add(:comments, :string)
      add(:is_active, :boolean, default: true)

      add(
        :customer_id,
        references(
          :customers,
          column: :customers_id,
          type: :string,
          on_delete: :nothing,
          on_update: :update_all,
          null: true
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

    create unique_index(:transactions, [:transactions_id])
  end
end
