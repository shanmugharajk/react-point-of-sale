defmodule EposWeb.SessionView do
  use EposWeb, :view

  def render("jwt.json", %{jwt: jwt}) do
    %{data: %{jwt: jwt}}
  end
end
