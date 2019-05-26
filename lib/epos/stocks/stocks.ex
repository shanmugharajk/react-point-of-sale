defmodule Epos.Stocks do
  import Ecto.{Query}, warn: false

  alias Ecto.Multi
  alias Epos.{Repo}
  alias Epos.Stocks.{Receiving, Stock}

  # ------------------------------------
  # STOCKS RELATED FUNCTIONS.
  # ------------------------------------

  def update_stock(id, qty, updated_by)
      when is_binary(id)
      when is_integer(qty)
      when is_binary(updated_by) do
    query = update_stock_query(id, qty, updated_by)
    Repo.update_all(query, [])
  end

  def update_stock(list_of_items, updated_by, action) when is_atom(action) do
    case action do
      :add -> do_add_to_stock(list_of_items, updated_by, 1)
      :sub -> do_add_to_stock(list_of_items, updated_by, -1)
    end
  end

  defp do_add_to_stock([], _updated_by, _sign), do: {:ok, true}

  defp do_add_to_stock([%{:product_id => id, :qty => qty} | t], updated_by, sign) do
    with {1, nil} <- update_stock(id, qty * sign, updated_by) do
      do_add_to_stock(t, updated_by, sign)
    else
      _ -> {:error, "Error in updating Stock"}
    end
  end

  # ------------------------------------
  # RECEIVINGS RELATED FUNCTIONS.
  # ------------------------------------

  def list_receivings(page_number, page_size),
    do: Repo.paginate(Receiving, page_number, page_size)

  def get_receiving(id) do
    case Repo.get_by(Receiving, id: id) do
      nil -> {:error, "No records"}
      receiving -> {:ok, receiving}
    end
  end

  def add_receiving(receiving_detail) do
    receivings_changeset =
      %Receiving{}
      |> Receiving.changeset(receiving_detail)

    product_id = receiving_detail["product_id"]

    case get_stock(product_id) do
      {:error, _} ->
        stocks_changeset = get_stocks_changeset_from_receiving_detail(receiving_detail)
        upsert_receiving_and_insert_stock(receivings_changeset, stocks_changeset)

      _stock ->
        query =
          update_stock_query(product_id, receiving_detail["qty"], receiving_detail["updated_by"])

        upsert_receiving_and_update_stock(receivings_changeset, query)
    end
  end

  def update_receiving(receiving_detail_new) do
    with {:ok, receiving} <- get_receiving(receiving_detail_new["id"]),
         {:ok, _} <- is_valid(receiving, receiving_detail_new) do
      cond do
        receiving_detail_new["qty"] < receiving.qty and receiving_detail_new["qty"] > 0 ->
          qty = (receiving.qty - receiving_detail_new["qty"]) * -1
          update_receiving_and_stock(receiving, receiving_detail_new, qty)

        receiving_detail_new["qty"] > receiving.qty ->
          qty = receiving_detail_new["qty"] - receiving.qty
          update_receiving_and_stock(receiving, receiving_detail_new, qty)

        true ->
          # We are incrementing zero just to satisfy the fun above to update.
          # TODO: Refactor this later.
          update_receiving_and_stock(receiving, receiving_detail_new, 0)
      end
    end
  end

  def delete_receiving(id, updated_by) do
    with {:ok, receiving} <- get_receiving(id) do
      update_query =
        from(s in Stock,
          where: s.stocks_id == ^receiving.product_id,
          update: [
            set: [updated_by: ^updated_by, updated_at: ^DateTime.utc_now()],
            inc: [qty: ^(receiving.qty * -1)]
          ]
        )

      Multi.new()
      |> Multi.delete(:receivings, receiving)
      |> Multi.update_all(:stocks, update_query, [])
      |> Repo.transaction()
      |> case do
        {:ok, _} ->
          {:ok, true}

        {:error, _failed_operation, _failed_value, _changes_so_far} ->
          {:error, "Error in updating receiving."}
      end
    end
  end

  # ------------------------------------
  # PRIVATE FUNCTIONS
  # ------------------------------------

  defp update_stock_query(id, qty, updated_by) do
    from(s in Stock,
      where: s.stocks_id == ^id,
      update: [
        set: [updated_by: ^updated_by, updated_at: ^DateTime.utc_now()],
        inc: [qty: ^qty]
      ]
    )
  end

  defp update_receiving_and_stock(old, new, qty) do
    query =
      from(s in Stock,
        where: s.stocks_id == ^new["product_id"],
        update: [
          set: [updated_by: ^new["updated_by"], updated_at: ^DateTime.utc_now()],
          inc: [qty: ^qty]
        ]
      )

    receiving_changeset = Receiving.changeset(old, new)
    upsert_receiving_and_update_stock(receiving_changeset, query)
  end

  defp is_valid(old, new) do
    cond do
      new["product_id"] != old.product_id ->
        {:error, "Cannot change the product in edit. If you wish to change then delete
         from the receiving and re-add it again with new product"}

      true ->
        {:ok, true}
    end
  end

  defp upsert_receiving_and_update_stock(receiving_changeset, stock_update_query) do
    Multi.new()
    |> Multi.insert_or_update(:receivings, receiving_changeset)
    |> Multi.update_all(:stocks, stock_update_query, [])
    |> Repo.transaction()
    |> case do
      {:ok, result} ->
        {:ok, result.receivings}

      {:error, _failed_operation, _failed_value, _changes_so_far} ->
        {:error, "Error in updating receiving."}
    end
  end

  defp upsert_receiving_and_insert_stock(receiving_changeset, stock_changeset) do
    Multi.new()
    |> Multi.insert_or_update(:receivings, receiving_changeset)
    |> Multi.insert(:stocks, stock_changeset)
    |> Repo.transaction()
    |> case do
      {:ok, result} ->
        {:ok, result.receivings}

      {:error, _failed_operation, _failed_value, _changes_so_far} ->
        {:error, "Error in updating receiving."}
    end
  end

  defp get_stock(id) do
    case Repo.get_by(Stock, stocks_id: id) do
      nil ->
        {:error, "No records"}

      stock ->
        {:ok, stock}
    end
  end

  defp get_stocks_changeset_from_receiving_detail(receiving_detail) do
    %Stock{}
    |> Stock.changeset(%{
      "stocks_id" => receiving_detail["product_id"],
      "qty" => receiving_detail["qty"],
      "created_by" => receiving_detail["created_by"],
      "updated_by" => receiving_detail["updated_by"]
    })
  end
end
