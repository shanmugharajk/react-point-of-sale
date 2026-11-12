# E2 — Sidebar shell

Goal: bare sidebar layout with a protected route group — pages land inside
a shell, not floating.

Done-when:
- [x] Sidebar layout renders around the home page
- [x] Theme switching works (system default, stored preference honored on
      login too)

Tasks:
- [x] E2-T1 theme provider — next-themes, system default + stored pref (web)
- [x] E2-T2 sidebar shell — shadcn sidebar, logo header, test menu (web)
- [x] E2-T3 sidebar footer — avatar, theme toggle, sign out (web)
- [x] E2-T4 (app) route group — protected layout wraps the shell (web)

Notes: theme = next-themes, class strategy, system default; no toggle on
the login page — the stored/system preference just applies there (common
practice). The shell is shadcn's sidebar component (base-nova variant)
with the favicon receipt mark as the logo; footer holds avatar, theme
toggle and sign out flat — one click each, no hidden menus for a 2–5
person shop. Verified in the browser: login → shell, both theme
directions, menu navigation with active state, sign out → login keeps the
stored theme.
