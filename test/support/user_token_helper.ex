defmodule EposWeb.UserTokenHelper do
  alias Epos.Accounts

  @super_admin_user %{
    "id" => "shan",
    "address" => "13 banergatta road",
    "email" => "email@email.com",
    "username" => "shan",
    "mobile" => "1234567890",
    "role" => "super_admin",
    "password" => "shan",
    "active" => true
  }

  @admin_user %{
    "id" => "admin",
    "address" => "13 banergatta road",
    "email" => "email@email.com",
    "username" => "shan",
    "mobile" => "1234567890",
    "role" => "admin",
    "password" => "admin",
    "active" => true
  }

  @basic_user %{
    "id" => "basic_user",
    "address" => "13 banergatta road",
    "email" => "email@email.com",
    "username" => "shan",
    "mobile" => "1234567890",
    "role" => "basic_user",
    "password" => "admin",
    "active" => true
  }

  def super_admin_user do
    @super_admin_user
  end

  def admin_user do
    @admin_user
  end

  def basic_user do
    @basic_user
  end

  def create_user(type) do
    case type do
      :super_admin ->
        get_user(@super_admin_user) |> Accounts.create_user()

      :admin ->
        get_user(@admin_user) |> Accounts.create_user()

      _ ->
        get_user(@basic_user) |> Accounts.create_user()
    end
  end

  def get_user(user), do: user |> Map.put("active", true)

  def fetch_jwt_token(type) do
    case type do
      :super_admin ->
        Accounts.auth(@super_admin_user["id"], @super_admin_user["password"])

      :admin ->
        Accounts.auth(@admin_user["id"], @admin_user["password"])

      _ ->
        Accounts.auth(@basic_user["id"], @basic_user["password"])
    end
  end
end
