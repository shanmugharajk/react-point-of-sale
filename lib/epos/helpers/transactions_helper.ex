defmodule Epos.Helpers.TransactionsHelper do
  def generate_transation_id do
    DateTime.utc_now()
    |> DateTime.to_unix(:millisecond)
  end

  def generate_transation_id(from) do
    Timex.to_datetime(from, :local)
    |> DateTime.to_unix(:millisecond)
  end
end
