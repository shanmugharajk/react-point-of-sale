# Roadmap

The growing plan. Status: **Phase 2 — in progress, customers
vertical next (see [`STATUS.md`](STATUS.md)).**

---

## Phase 1 — Product discovery — ✅ done

What we're building and why, settled in three interview rounds.
Source of truth: [`discovery/decisions.md`](discovery/decisions.md)
(D1–D51, all confirmed). Interviews archived in
[`discovery/discussions/`](discovery/discussions/).

## Phase 2 — Engineering foundation

Built as four small verticals: login → sidebar shell → customers
vertical → roles.

- **Login & shell** — login/logout (better-auth), protected routes,
  sidebar layout with theme switching.
- **Customers vertical** — one tiny end-to-end CRUD (customers) that
  proves the patterns hold up in real life. Must cover: service-layer
  pattern · query style · validation · error handling and result
  types · forms · **the transaction recipe** (bill + stock + ledger
  move atomically — the heart of the app) · audit-log pattern ·
  paise and IST helpers.
- **Roles** — admin/staff roles on better-auth, completing the
  foundation before Phase 3.

## Phase 3 — Epics

Defined once the foundation verticals are done, so every epic can
follow the proven patterns instead of leaving an agent to improvise.
Each epic gets: a one-line goal, a precise in/out boundary,
acceptance criteria, and the D-numbers it implements. Order:

1. Masters (products, service catalog, vendors, employees, expense types,
   customers)
2. Stock & purchases (batches, opening stock, live stock)
3. Product billing (credit, discounts, returns, cancel)
4. Service orders (statuses, advances, delivery list)
5. Payments & ledger (customer payments, balances, opening balances)
6. Expenses & salary
7. Reports

After that: mechanical execution.
