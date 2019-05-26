defmodule EposWeb.VendorsView do
  use EposWeb, :view

  alias EposWeb.VendorsView

  def render("index.json", %{vendors: vendors}) do
    %{
      data: render_many(vendors.data, VendorsView, "vendor.json", as: :vendor),
      pagination_info: vendors.pagination_info
    }
  end

  def render("show.json", %{vendor: vendor}) do
    %{data: render_one(vendor, VendorsView, "vendor.json", as: :vendor)}
  end

  def render("vendor.json", %{vendor: vendor}) do
    %{
      id: vendor.vendors_id,
      name: vendor.name,
      mobile: vendor.mobile,
      description: vendor.description,
      address: vendor.address,
      email: vendor.email,
      active: vendor.active,
      created_by: vendor.created_by,
      updated_by: vendor.updated_by,
      created_at: vendor.inserted_at,
      updated_at: vendor.updated_at
    }
  end
end
