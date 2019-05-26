use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :epos, EposWeb.Endpoint,
  http: [port: 4002],
  server: false,
  debug_errors: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :epos, Epos.Repo,
  username: "postgres",
  password: "postgres",
  database: "epos_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
