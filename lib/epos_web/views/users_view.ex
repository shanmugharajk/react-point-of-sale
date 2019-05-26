defmodule EposWeb.UsersView do
  use EposWeb, :view

  alias EposWeb.UsersView

  def render("index.json", %{users: users}) do
    %{
      data: render_many(users.data, UsersView, "user.json", as: :user),
      pagination_info: users.pagination_info
    }
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UsersView, "user.json", as: :user)}
  end

  def render("user.json", %{user: user}) do
    %{
      id: user.users_id,
      username: user.username,
      email: user.email,
      address: user.address,
      mobile: user.mobile,
      role: user.role,
      active: user.active
    }
  end
end
