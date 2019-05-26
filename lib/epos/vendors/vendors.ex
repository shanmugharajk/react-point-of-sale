defmodule Epos.Vendors do
  import Ecto.Query, warn: false

  alias Epos.Repo
  alias Epos.Vendors.Vendor

  def list_vendors, do: Repo.paginate(Vendor)

  def list_vendors(page_number, page_size),
    do: Repo.paginate(Vendor, page_number, page_size)

  def get_vendor(id) do
    case Repo.get_by(Vendor, vendors_id: id) do
      nil ->
        {:error, "No records"}

      vendor ->
        {:ok, vendor}
    end
  end

  def create_vendor(attrs) do
    data =
      attrs
      |> Map.put("vendors_id", attrs["id"])

    %Vendor{}
    |> Vendor.changeset(data)
    |> Repo.insert()
  end

  def update_vendor(vendor, attrs) do
    vendor
    |> Vendor.changeset(attrs)
    |> Repo.update()
  end

  def update_vendor_by_id(id, attrs) do
    with {:ok, vendor} <- get_vendor(id) do
      vendor
      |> Vendor.changeset(attrs)
      |> Repo.update()
    end
  end

  def delete_vendor(vendor), do: Repo.delete(vendor)
end
