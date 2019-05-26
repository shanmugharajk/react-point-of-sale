defmodule Epos.Helpers.MoneyHelper do
  def multiply(amount, multiplier)
      when is_float(amount) or is_number(amount)
      when is_float(multiplier) or is_number(multiplier) do
    (Money.new(round(amount * 100))
     |> Money.multiply(multiplier)).amount / 100
  end

  def subtract(amount, subtractend)
      when is_float(amount) or is_number(amount)
      when is_float(subtractend) or is_number(subtractend) do
    amount_m = Money.new(round(amount * 100))
    subtractend_m = Money.new(round(subtractend * 100))
    Money.subtract(amount_m, subtractend_m).amount / 100
  end

  def add(amount, addend)
      when is_float(amount) or is_number(amount)
      when is_float(addend) or is_number(addend) do
    amount_m = Money.new(round(amount * 100))
    addend_m = Money.new(round(addend * 100))
    Money.add(amount_m, addend_m).amount / 100
  end
end
