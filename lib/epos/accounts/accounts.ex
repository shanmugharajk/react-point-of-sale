defmodule Epos.Accounts do
  import Ecto.Query, warn: false
  alias Epos.Repo

  alias Epos.Guardian
  alias Epos.Accounts.User
  # import Comeonin.Bcrypt, only: [checkpw: 2, dummy_checkpw: 0]

  def list_users(page_number \\ 1, page_size \\ 10),
    do: Repo.paginate(User, page_number, page_size)

  def delete_user(%User{} = user), do: Repo.delete(user)

  def get_user(id) do
    case Repo.get_by(User, users_id: id) do
      nil ->
        # dummy_checkpw()
        {:error, "No records"}

      user ->
        {:ok, user}
    end
  end

  def create_user(attrs) do
    data =
      attrs
      |> Map.put("users_id", attrs["id"])

    %User{}
    |> User.changeset(data)
    |> Repo.insert()
  end

  def update_user(user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def auth(userid, password) when is_binary(userid) and is_binary(password) do
    sign = fn user ->
      Guardian.encode_and_sign(
        user,
        %{role: user.role},
        permissions: get_permissions_by_role(String.to_atom(user.role)),
        ttl: {24 * 60, :minute}
      )
    end

    with {:ok, user} <- get_user(userid),
         {:ok, _} <- verifypw(user, password),
         {:ok, token, _claims} <- sign.(user) do
      {:ok, token}
    else
      {:error, message} -> {:error, message}
    end
  end

  def get_permissions_by_role(role) do
    roles = Application.get_env(:epos, Epos.Auth)[:roles]
    r = String.to_atom(Map.get(roles, role, "basic_user"))
    p = Application.get_env(:epos, Guardian)[:permissions][r]
    Map.put(%{}, r, p)
  end

  # Private functions
  defp verifypw(user, password) do
    if checkpw(password, user.password_hash) == true,
      do: {:ok, user},
      else: {:error, "Invalid username or password"}
  end

  # Dummy function to avoid bcrypt since it's not compiling in windows.
  # TODO: For now this is ok. Refactor this and find a fix.
  defp checkpw(password, hashPassword) do
    if password !== hashPassword,
      do: false,
      else: true
  end
end
