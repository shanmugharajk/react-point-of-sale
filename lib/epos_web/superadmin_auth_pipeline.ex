defmodule EposWeb.Guardian.SuperAdminAuthPipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :epos,
    module: Epos.Guardian,
    error_handler: EposWeb.AuthErrorHandler

  roles = Application.get_env(:epos, Epos.Auth)[:roles]
  role = Map.get(roles, :super_admin)

  plug Guardian.Plug.VerifyHeader, realm: "Bearer"
  plug Guardian.Plug.EnsureAuthenticated, claims: %{"role" => role}
  plug Guardian.Permissions.Bitwise, ensure: %{super_admin: [:all_access]}
  plug Guardian.Plug.LoadResource
end
