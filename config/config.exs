# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :epos,
  ecto_repos: [Epos.Repo]

# Configures the endpoint
config :epos, EposWeb.Endpoint,
  url: [host: "localhost"],
  debug_errors: false,
  secret_key_base: "Hzu44/va2ZxAkYocqEGHKZUmGD6qJpdJdPGuejD/dc8sdNX15pjzOHNqNcHvvPnd",
  render_errors: [view: EposWeb.ErrorView, accepts: ~w(json)],
  pubsub: [name: Epos.PubSub, adapter: Phoenix.PubSub.PG2]

config :epos, Epos.Auth,
  roles: %{
    :super_admin => "super_admin",
    :admin => "admin",
    :basic_user => "basic_user"
  }

# Guardian config
config :epos, Epos.Guardian,
  issuer: "epos",
  secret_key: "+rENf7iolLX1ySSwS6smLJ+p/5ArJsI8DAgjhuCUMBFszV9aul8SO4jncpcfhS1x",
  permissions: %{
    basic_user: [
      :sales,
      :stock
    ],
    super_admin: [
      :all_access
    ],
    admin: [
      :sales,
      :stock,
      :products,
      :expense_write,
      :receivings_write
    ]
  }

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Money config.
config :money,
  default_currency: :INR,
  separator: ".",
  delimeter: ".",
  symbol: false,
  symbol_on_right: false,
  symbol_space: false

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
