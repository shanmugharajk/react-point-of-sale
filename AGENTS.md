# AGENTS.md

- Product truth lives in `.docs/`: [`roadmap.md`](.docs/roadmap.md) for phase
  and status, [`discovery/decisions.md`](.docs/discovery/decisions.md) for
  product rules (D1–D51). Read only what the current task needs — not
  everything upfront.
- Commits are **one line only** — `type: what the app can now do`; never
  the parts it was built from (packages, files, tables are the work, not
  the outcome). No body, no "x plus y" chaining.
  - right: `feat: manage customers` · `feat: barcode search at counter`
  - wrong: `feat: customers vertical with services, contracts and audit
    log` (inventory of parts — never says what the user gained)
