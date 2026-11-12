# E1 — Login vertical

Goal: a seeded admin signs in and lands on a protected home page — the
first pattern-proving vertical (form pattern, error mapping, session
reads).

Done-when:
- [x] Seeded admin signs in on /login and lands on /
- [x] Signed-out / redirects to /login; signed-in /login redirects back to /
- [x] Wrong password shows an error on the form, never a thrown page
- [x] Sign out returns to /login
- [x] Gate green (biome + tsc + build); flow verified against the running
      server

Tasks:
- [x] E1-T1 seed admin user (db)
- [x] E1-T2 login page — RHF + zod + authClient, server-error mapping (web)
- [x] E1-T3 protected home + redirects (web)
- [x] E1-T4 sign out (web)

Notes: T1 landed as the better-auth CLI (`create-admin`, documented in the
README) instead of a hand-rolled seed row — the official path hashes and
roles correctly with zero code to maintain. A stale-cookie redirect loop
was caught and killed during verification (see ../gotchas/auth.md).
