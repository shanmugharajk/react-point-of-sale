defmodule EposWeb.Guardian.AuthPipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :epos,
    module: Epos.Guardian,
    error_handler: EposWeb.AuthErrorHandler

  plug Guardian.Plug.VerifyHeader, realm: "Bearer"
  plug Guardian.Plug.EnsureAuthenticated
  plug Guardian.Plug.LoadResource
end
