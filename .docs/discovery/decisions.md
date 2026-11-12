# POS MVP 1.0 — product decisions (source of truth)

Last updated: 2026-11-12, after round 3. **All decisions confirmed —
discovery closed.** This is the document to open whenever there is a doubt
about what the product does or why. Every decision has a stable number
(D1–D51); the interview rounds that produced them are archived alongside
([round 1](discussions/round-1-product-interview.md), [round 2](discussions/round-2-confirms.md), [round 3](discussions/round-3-research-and-close.md) —
round 3 also carries the external research references).

---

## The product in one paragraph

A web app for one shop that sells products from stock and takes service
jobs such as design work and printouts. It records bills, service orders,
stock, customer credit, purchases and expenses — so the owner can always
see three things: what the shop **earned**, what it actually
**collected**, and **who owes what**. The only users are the owner
(admin) and the shop's employees. There is no payment gateway, no tax
configuration and no cash drawer; this is a billing-and-bookkeeping tool,
not a payment tool. A React Native app may come later — until then the
web app must also work well on a phone screen.

## Scope

**In 1.0**: product bills · service orders · customers and the credit
ledger · live stock with low-stock warning and opening stock · purchases
and vendors with FIFO batches · service catalog · expenses and salaries ·
admin/staff roles · today's delivery list · on-screen balances · note
lines on bills and orders.

**Later (1.1+)**: vendor payment entries · stock count and correction ·
damage / return-to-vendor entries · task assignment for employees ·
designed reports · receipt printing beyond the browser · offline mode ·
tax masters.

**Reports** are deliberately planned after all the CRUDs exist — but
nothing here blocks them. The accounting model they will use is D42/D43
below.

---

## Users & access

- **D1.** Two roles exist: Admin (the owner) and Staff.
- **D2.** Every user has an individual login, including staff. The audit
  trail must be able to say who did what — a shared "staff" login would
  break that.
- **D3.** Staff can create bills and service orders, and cancel them.
  Every other kind of edit, and every deletion, is admin-only.
- **D4.** Money records are never edited in place and never hard-deleted.
  A wrong bill is cancelled and re-entered; "delete" is a soft delete that
  hides the record but keeps it. Money history must always be
  reconstructable.
- **D5.** A generic audit log records who, when and what for every
  create, update, cancel and soft-delete of money-related records.
- **D6.** Expect 2–5 people using the app at the same time.
- **D51.** Staff can create customers at the counter — credit sales and
  service orders need it. Everything that is master data (products,
  service catalog, vendors, purchases) plus the money pages (expenses,
  salaries, reports) is admin-only, and staff cannot even see it. Exact
  page-by-page permissions can be tuned as we build.

## Product bills

- **D7.** A product bill and a service order are always separate
  documents — never mixed on one bill.
- **D8.** Bill numbers are generated automatically, sequential per year:
  `PB-2026-0001` for product bills, `SV-2026-0001` for service orders.
- **D9.** A product bill is either paid in full at the counter, or it is a
  credit sale. A part payment makes it a credit sale — the unpaid
  remainder lands on the customer's balance. Credit requires a registered
  customer; walk-ins (name and mobile optional) always pay and take.
- **D10.** Discounts are allowed on bills.
- **D11.** GST appears as one optional free-form amount per bill, saved
  exactly as typed. No shop GST number, no tax masters in 1.0.
- **D12.** Cancelling a bill restores the stock it consumed and writes a
  reversal entry in the customer's ledger where money was involved.
- **D13.** Returns can be full or partial and are always made against the
  original bill; they restore stock. For a credit customer, a return
  either refunds cash or reduces what they owe — chosen at the moment of
  the return. For a walk-in, cash is refunded immediately.
- **D14.** No receipt-printing design in 1.0 — a clean, printable in the
  browser (Cmd+P) view of a bill is enough.
- **D49.** Bills and service orders carry an optional free-text note line
  (customer instructions, "urgent", a reference). Cheap now, annoying to
  retrofit.

## Service orders

- **D15.** A service order moves through: **taken → working → ready →
  delivered**. Its payment state (paid, or ₹X due) is computed from the
  ledger, never typed by hand.
- **D16.** Name and mobile are mandatory on every service order, even
  when the job is fully paid in advance — the work is delivered later, so
  the customer must always be identifiable.
- **D17.** Every service order links to a real customer record: found by
  mobile number, or auto-created on the spot. This is what makes
  "delivered, ₹X due" land on someone's account.
- **D18.** The advance has no rule — any amount. More than one payment
  before delivery is allowed; the ledger handles it naturally.
- **D19.** A delivered order with an unpaid balance shows as "delivered,
  ₹X due", and the amount counts in what that customer owes. There is no
  separate credit-bill document for this.
- **D20.** The daily delivery list shows the jobs promised for today, plus
  a separate section for overdue jobs — promised earlier, still not
  delivered.
- **D21.** The assignee field is optional. Admin can assign anyone,
  including themselves.
- **D22.** Service line items come from a small service catalog (name +
  default price) for quick filling; the price can be changed at the
  counter as a discount.
- **D23.** One service order can hold several line items — 100 printouts
  plus binding plus design on one job is normal.

## Customers & credit

- **D24.** A customer is identified by mobile number. Two people sharing
  one phone are deliberately clubbed into one customer.
- **D25.** Credit customers must be registered first: name and mobile
  required, address and email optional. Walk-in product sales need no
  customer record at all.
- **D26.** A customer's balance is always **computed from events** —
  opening balance, plus unpaid bills, plus unpaid service balances, minus
  payments, minus return credits. It is never stored as a number someone
  edits. A mistake is fixed with a new correcting entry, so history is
  never lost.
- **D27.** Payments are **on account**: a payment reduces the customer's
  total balance and is not tied to one specific bill. Every payment is a
  ledger entry, so the audit trail comes free.
- **D28.** One shared balance per customer, across product bills and
  service orders together. A ₹500 payment simply reduces whatever is
  outstanding.
- **D29.** The system starts clean — no migration — except that each
  existing credit customer's current dues are entered once as an
  opening-balance entry.
- **D30.** The customer statement (bills and payments history) stays on
  screen in 1.0 — no print view.

## Stock & purchases

- **D31.** Live stock: quantity is deducted on every product sale and
  restored on cancel and return. The low-stock warning uses a per-product
  editable threshold, default 5. Damage/loss entries and stock corrections
  are deliberately deferred to 1.1 — with those deferred, live stock
  really is just "deduct on sale".
- **D32.** A purchase is recorded as a **batch** ("lot"): one vendor, one
  date, and items with quantity and unit cost. The same product can carry
  different costs in different batches — the October ₹10 / November ₹12
  case.
- **D33.** Costing is **FIFO**: a sale consumes units from the oldest
  batch that still has stock, and that batch's cost becomes the sale's
  cost. Exact cost of goods sold, and it matches "one price within a
  batch".
- **D34.** The selling price lives on the batch too. Each purchase batch
  holds its own selling price / MRP; a blank inherits the product's
  current price. At the counter, a product's default price is the price of
  its oldest batch that still has stock — matching the shelf, where old
  stock sits in front. The line price can always be overridden; the MRP
  printed on the packet in hand is the authority. Every bill line stores
  the actual price it sold at and the batch it consumed, so revenue and
  cost are both exact per line. This follows standard Indian POS practice
  — research references in [round 3](discussions/round-3-research-and-close.md).
- **D35.** The vendor master stays light: name, mobile, email, address.
- **D36.** Vendor dues (payables) are computed from purchase totals for
  free, but there is no vendor-payment entry UI until 1.1.
- **D37.** Purchases can be entered the same day or later — the app does
  not enforce same-day entry.
- **D38.** The catalog is small (under 500 products); searching by name is
  the primary way to find one. Products may carry an optional barcode and
  the counter search matches name **or** barcode — a scanner is just a
  keyboard that types the code into the search box. Category is an
  optional field.
- **D50.** Day one begins with an **opening-stock** entry per product:
  quantity, unit cost and the batch's selling price, no vendor. It becomes
  the first FIFO batch. The system starts clean, but the real shelf is not
  empty.

## Expenses & salary

- **D39.** Expenses are entered by admin only. Expense type is master
  data.
- **D40.** Salaries are their own entry type: employee + month + amount +
  paid date. The month is the calendar month the salary is for; the
  paid-on date is a free date field — admin picks any date, and its
  correctness is the admin's responsibility. Reports will show salaries
  separately and also rolled into total expenses. The door stays open for
  employee advance/loan entries later, with no UI in 1.0.
- **D41.** An employee list exists in 1.0 (needed for salary and audit),
  even though task assignment arrives in 1.1. Employees are on monthly
  salary.

## Money & accounting rules

- **D42.** The monthly picture is always two numbers, never one:
  **earned** — sales minus cost minus expenses, counted in the month the
  sale happened — and **collected** — the cash that actually came in,
  including repayments of old debts. **Who owes what** (outstanding
  credit) is a third, separate number.
- **D43.** A late debt payment never counts as profit again. It raises
  that month's "collected" and lowers the customer's balance; the profit
  was already counted in the month of the sale.
- **D44.** All money amounts are stored as integers in paise, never
  floating point. The screen shows rupees.
- **D45.** Every payment can carry an optional mode: cash / UPI / bank.

## Practical

- **D46.** The app is online-only. If the internet drops, billing pauses —
  accepted for 1.0.
- **D47.** The web app is mobile-friendly and responsive; the React Native
  app comes later.
- **D48.** The shop's timezone is IST. "Today" and "this month" mean IST.

## Vocabulary

- Money **customers owe us** → *receivables* / customer credit.
- Money **we owe vendors** → *payables* / vendor dues.

---

## Decision log

- **2026-11-11 — Round 1.** The shape of the product settled: bills vs
  service orders as separate documents, ledger-based customer balances,
  live stock, FIFO batches, integer paise, cancel-not-edit for money
  records.
- **2026-11-11 — Round 2.** Confirmed: service orders always create a
  customer record, multiple payments before delivery, service catalog for
  quick fill, returns only against a bill, one shared balance per
  customer, note lines, per-product low-stock threshold. Two answers
  asked questions back — selling price per batch, barcode — taken to
  round 3.
- **2026-11-12 — Round 3.** Confirmed: barcode field, opening stock,
  staff powers, salary date rules. Selling price moved onto the batch
  (D34) after the MRP pushback and research into Indian POS practice
  (Marg, myBillBook, Vyapar — references in round 3). Discovery closed;
  next step is engineering decisions.
