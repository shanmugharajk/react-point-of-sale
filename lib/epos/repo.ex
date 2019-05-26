defmodule Epos.Repo do
  use Ecto.Repo,
    otp_app: :epos,
    adapter: Ecto.Adapters.Postgres

  alias Epos.Helpers.PaginationHelper

  def paginate(query, page_number \\ 1, page_size \\ 10) do
    PaginationHelper.fetch_data(query, page_number, page_size)
  end
end
