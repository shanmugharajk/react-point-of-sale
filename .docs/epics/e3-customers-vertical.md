# E3 — Customers vertical

Goal: customers CRUD + one sell action inside the shell — proves the
services/contracts packages, the transaction recipe, the audit log, and
the paise/IST helpers.

Done-when:
- [x] Customer CRUD per D25 flows through services + server actions
- [ ] One sell action writes bill + stock + ledger in one transaction
- [x] Every write lands an audit row (who = session user)

Tasks:
- [x] E3-T1 customers + audit_log schema — soft delete, partial unique
      mobile (db)
- [x] E3-T2 contracts package — zod DTOs, ActionResult (contracts)
- [x] E3-T3 customers service — AppError, transactional audit (services)
      (see decisions/0001-generic-audit-table.md)
- [x] E3-T4 customers page — table, dialogs, RHF forms, pagination,
      admin-gated edit/delete, IST dates (web)
