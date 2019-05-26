defmodule Epos.Products do
  import Ecto.Query, warn: false
  alias Epos.Repo

  alias Epos.Products.{ProductType, Product}

  # --------------
  # PRODUCT TYPE
  # ---------------
  def list_product_types, do: Repo.all(ProductType)

  def list_product_types(page_number, page_size),
    do: Repo.paginate(ProductType, page_number, page_size)

  def search_product_type_by_id(id, page_number, page_size) do
    from(p in ProductType, where: ilike(p.product_types_id, ^"%#{id}%"))
    |> Repo.paginate(page_number, page_size)
  end

  def get_product_type(id) do
    case Repo.get_by(ProductType, product_types_id: id) do
      nil -> {:error, "No records"}
      product_type -> {:ok, product_type}
    end
  end

  def create_product_type(attrs) do
    data =
      attrs
      |> Map.put("product_types_id", attrs["id"])

    %ProductType{}
    |> ProductType.changeset(data)
    |> Repo.insert()
  end

  def update_product_type(product_type, attrs) do
    product_type
    |> ProductType.changeset(attrs)
    |> Repo.update()
  end

  def update_product_type_by_id(id, attrs) do
    with {:ok, product_type} <- get_product_type(id) do
      product_type
      |> ProductType.changeset(attrs)
      |> Repo.update()
    end
  end

  def delete_product_type(product_type), do: Repo.delete(product_type)

  # --------------
  # PRODUCT
  # ---------------
  def list_products, do: Repo.all(Product)

  def list_products(page_number, page_size),
    do: Repo.paginate(Product, page_number, page_size)

  def search_product_by_id(id, page_number, page_size) do
    from(p in Product, where: ilike(p.products_id, ^"%#{id}%"))
    |> Repo.paginate(page_number, page_size)
  end

  def get_product(id) do
    case Repo.get_by(Product, products_id: id) do
      nil -> {:error, "No records"}
      product -> {:ok, product}
    end
  end

  def create_product(attrs) do
    data =
      attrs
      |> Map.put("products_id", attrs["id"])

    %Product{}
    |> Product.changeset(data)
    |> Repo.insert()
  end

  def update_product(product, attrs) do
    product
    |> Product.changeset(attrs)
    |> Repo.update()
  end

  def update_product_by_id(id, attrs) do
    with {:ok, product} <- get_product(id) do
      product
      |> Product.changeset(attrs)
      |> Repo.update()
    end
  end

  def delete_product(product), do: Repo.delete(product)
end
