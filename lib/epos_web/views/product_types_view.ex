defmodule EposWeb.ProductTypesView do
  use EposWeb, :view

  alias EposWeb.ProductTypesView

  def render("index.json", %{product_types: product_types}) do
    %{
      data:
        render_many(product_types.data, ProductTypesView, "product_type.json", as: :product_type),
      pagination_info: product_types.pagination_info
    }
  end

  def render("show.json", %{product_type: product_type}) do
    # Note: If we didn't give the 'as: :product_type' the it will pass
    # as product_types - as the view name
    %{data: render_one(product_type, ProductTypesView, "product_type.json", as: :product_type)}
  end

  def render("product_type.json", %{product_type: product_type}) do
    %{
      id: product_type.product_types_id,
      description: product_type.description,
      created_by: product_type.created_by,
      updated_by: product_type.updated_by,
      created_at: product_type.inserted_at,
      updated_at: product_type.updated_at
    }
  end
end
