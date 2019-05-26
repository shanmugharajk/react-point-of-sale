defmodule Epos.Helpers.PaginationHelper do
  import Ecto.Query, warn: false
  alias Epos.Repo

  def fetch_data(query, page_number \\ 1, page_size \\ 10) do
    rows = total_rows(query)
    pages = total_pages(rows)

    offset = page_size * (page_number - 1)

    data =
      query
      |> limit(^page_size)
      |> offset(^offset)
      |> Repo.all()

    %{
      data: data,
      pagination_info: %{
        total_pages: pages,
        total_rows: rows,
        page_number: page_number,
        page_size: page_size
      }
    }
  end

  defp total_rows(query) do
    query
    |> subquery()
    |> select(count("*"))
    |> Repo.one()
  end

  defp total_pages(total_entries, page_size \\ 10) do
    (total_entries / page_size)
    |> Float.ceil()
    |> round
  end
end
