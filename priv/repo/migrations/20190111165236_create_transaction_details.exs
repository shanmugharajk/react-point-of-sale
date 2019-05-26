defmodule Epos.Repo.Migrations.CreateTransactionDetails do
  use Ecto.Migration

  def change do
    create table(:transaction_details, primary_key: false) do
      add(
        :transaction_details_id,
        references(:transactions,
          column: :transactions_id,
          type: :bigint
        ),
        primary_key: true
      )

      add(
        :product_id,
        references(:products,
          column: :products_id,
          type: :string,
          primary_key: :products_id
        ),
        primary_key: true
      )

      add(:qty, :integer, null: false)
      add(:cost_price, :bigint, null: false)
      add(:selling_price, :bigint, null: false)
      add(:discount_price, :bigint, null: false)
      add(:discount_total_price, :bigint, null: false)
      add(:is_reverted, :boolean, null: false, default: false)

      # Actual price.
      add(:bill_price, :bigint, null: false)

      # After discount_price
      add(:net_price, :bigint, null: false)

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
