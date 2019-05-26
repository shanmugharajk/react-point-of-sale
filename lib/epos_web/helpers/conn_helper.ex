defmodule EposWeb.Helpers.ConnHelper do
  def get_pagination_detail(conn) do
    default = {1, 10}

    case conn.params do
      nil ->
        default

      _ ->
        pno = conn.params["page_number"]
        psize = conn.params["page_size"]

        case pno != nil and psize != nil do
          true ->
            with {page_number, _} <- Integer.parse(pno),
                 {page_size, _} <- Integer.parse(psize) do
              {page_number, page_size}
            else
              _ ->
                default
            end

          _ ->
            default
        end
    end
  end
end
