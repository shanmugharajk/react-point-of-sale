defmodule Epos.Repo.Migrations.CreateReceivings do
  use Ecto.Migration

  def change do
    create table(:receivings) do
      add(
        :vendor_id,
        references(:vendors,
          column: :vendors_id,
          type: :string,
          on_delete: :nothing,
          on_update: :update_all
        ),
        null: false
      )

      add(
        :product_id,
        references(:products,
          column: :products_id,
          type: :string,
          on_delete: :nothing,
          on_update: :update_all
        ),
        null: false
      )

      add(:qty, :integer, null: false)
      add(:price, :bigint, null: false)
      add(:received_date, :utc_datetime, null: false)

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
