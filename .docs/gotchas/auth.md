# Auth gotchas

Traps hit while building the login vertical (E1). Each cost real debugging
time.

## Read the session inside `<Suspense>`, never in the page body

With cache components, `headers()` in the page body fails the build —
"accessed outside of `<Suspense>`". Wrap the session read in a small async
component under `<Suspense>`: the shell (login form, page chrome)
prerenders, only the gate streams. `export const instant = false` also
silences the error but ships an empty shell — don't.

That gate's `redirect()` is not an HTTP 307, either: document requests get
a 200 shell and the redirect travels in the RSC payload. Browsers follow
it; curl won't. Clean 307s for signed-out visitors are the proxy's job
(`proxy.ts`) — the page redirect is just a backstop.

## The proxy only knows a cookie exists, not that it is valid

If it bounced cookie-bearing visitors off `/login`, an expired cookie would
ping-pong `/` ↔ `/login` until the browser quits (ERR_TOO_MANY_REDIRECTS).
So `/login` is exempt, and the login page sends valid sessions home after a
real check. Keep DB checks out of the proxy entirely — it runs on every
request, prefetches included. Pages do the real validation via
`getSession()` (`lib/session.ts`, cached — one DB read per render pass).

## curl POSTs need an Origin header

better-auth rejects cookie-bearing POSTs without a matching
`Origin`/`Referer` — a silent 403. Browsers always send it; curl doesn't.
Test auth mutations with `-H "Origin: http://localhost:3000"`.
