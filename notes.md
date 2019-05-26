# Epos

Point of sale application.

## To clear the iex console in windows

[SO link](https://stackoverflow.com/questions/30899247/how-can-we-clear-the-screen-in-iex-on-windows)

`Application.put_env(:elixir, :ansi_enabled, true)`

## Psql commands

```bash
\! clear - clears the screen
\l - list all the database
\c dbname username
\dt - list all tables
\d tablename
drop database
psql -U postgres -c "drop database databasename"
mix run priv/repo/seeds.exs
```

## Ecto relationship guides

[Check here](https://github.com/phoenixframework/phoenix_guides/issues/607)

## Pagination options

[skip-offset](https://github.com/drewolson/scrivener_ecto)
[cursor-keyset](https://github.com/duffelhq/paginator)
[bleacher-report cursor-based](https://github.com/bleacherreport/ecto_cursor_pagination) - This one seems simple. For now this should be implemented.

## Sample queries

```elixir
    def run do
    query =
        from et in ExpenseType,
        where: like(et.expense_types_id, "%4%"),
        select: et.expense_types_id

    fetch_data(query)
    end
```

## Timestamps

[blog](https://michal.muskala.eu/2017/02/02/unix-timestamps-in-elixir-1-4.html)

## Shell alias

```shell
alias drop=dropdb -U postgres epos_dev
alias drop_t=dropdb -U postgres epos_test
alias pr=iex -S mix phx.server
alias em=mix ecto.migrate
alias ec=mix ecto.create
alias seed= mix run priv\\repo\\seeds.exs
alias pc=psql -U postgres
alias mt=mix test
```

## Error handling

[read it](https://www.amberbit.com/blog/2018/7/24/when-web-requests-fail-in-elixir-and-phoenix/)
[simple example](https://snippets.aktagon.com/snippets/773-logging-to-a-file-with-elixir)

## Deployment

[Good one - has digital ocean](https://www.cogini.com/blog/best-practices-for-deploying-elixir-apps/)

## Project website

[very simple](https://www.getcalculate.com/#early-access)

## UI

[mobx routing](https://medium.freecodecamp.org/how-to-route-like-a-hacker-with-mobx-and-router5-d79a5c7a56a)
[mobx simple router](https://github.com/kitze/mobx-router)
