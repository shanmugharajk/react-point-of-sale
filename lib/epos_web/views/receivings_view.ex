defmodule EposWeb.ReceivingsView do
  use EposWeb, :view

  alias EposWeb.ReceivingsView

  def render("index.json", %{receivings: receivings}) do
    %{
      data: render_many(receivings.data, ReceivingsView, "receiving.json", as: :receiving),
      pagination_info: receivings.pagination_info
    }
  end

  def render("show.json", %{receiving: receiving}) do
    %{data: render_one(receiving, ReceivingsView, "receiving.json", as: :receiving)}
  end

  def render("receiving.json", %{receiving: receiving}) do
    %{
      id: receiving.id,
      inserted_at: receiving.inserted_at,
      price: receiving.price.amount,
      product_id: receiving.product_id,
      qty: receiving.qty,
      received_date: receiving.received_date,
      updated_at: receiving.updated_at,
      created_by: receiving.created_by,
      updated_by: receiving.updated_by,
      vendor_id: receiving.vendor_id
    }
  end
end
