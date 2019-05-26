defmodule EposWeb.ProductsView do
  use EposWeb, :view

  alias EposWeb.ProductsView

  def render("index.json", %{products: products}) do
    %{
      data: render_many(products.data, ProductsView, "product.json", as: :product),
      pagination_info: products.pagination_info
    }
  end

  def render("show.json", %{product: product}) do
    # Note: If we didn't give the 'as: :product' the it will pass
    # as products - as the view name
    %{data: render_one(product, ProductsView, "product.json", as: :product)}
  end

  def render("product.json", %{product: product}) do
    %{
      id: product.products_id,
      name: product.name,
      product_type_id: product.product_type_id,
      description: product.description,
      created_by: product.created_by,
      updated_by: product.updated_by,
      created_at: product.inserted_at,
      updated_at: product.updated_at,
      cost_price: product.cost_price.amount,
      selling_price: product.selling_price.amount
    }
  end
end
