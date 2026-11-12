# Discovery — round 1 (archived interview)

> **Archive.** Questions with inline answers, kept as the "why" behind
> decisions. The agreed outcomes live in [`decisions.md`](../decisions.md);
> anything still open moved to later round files.

Single shop. Web only now, mobile later. Users: owner (admin) + employees.
No payment gateway, no cash drawer, no tax masters.

---

## What I understood so far (correct me if wrong)

- Two kinds of selling: **products** (sold from stock) and **services**
  (designing, printouts, etc.). Both can be paid fully, partly, or on credit.
  **Answer** — Yes. Partly means it's a credit sale only. Also for services,
  regardless of sale type, we need name and mobile number as mandatory, since
  a service is catered in an async way based on the type of work.
- **Product sale**: customer pays and takes the item. Returns are rare but
  must exist in the system.
  **Answer** — Yes.
- **Service**: usually an advance at intake, balance at delivery, sometimes
  credit after delivery. Each service has a promised delivery date (we need
  a "today's deliveries" list) and an optional assignee. Owner assigns, or
  leaves it empty.
  **Answer** — Yes.
- **Walk-in customer**: name or mobile optional. **Credit customer**: must
  exist in the system first — name + mobile required, address/email optional.
  **Answer** — Yes.
- **Purchases**: stock arrives from vendors, cost price changes month to
  month. Vendor master is light: name, mobile, email, address. Vendor
  payments are deferred to 1.1.
  **Answer** — Yes.
- **Tax**: no masters. A free-form number/text field on billing where
  applicable, saved as entered.
  **Answer** — Yes.
- **Expenses**: entered by admin only. Expense type is master data. Employee
  salaries must be tracked with pay dates. Task assignment comes in 1.1.
  **Answer** — Yes. Need your input on separate salary table or how.
- **Reports**: designed after the CRUDs exist, but the data model must not
  block them.
  **Answer** — Yes.

---

## A. Shop & users

1. **[blocks schema]** Roughly how many products in the catalog — 50? 500?
   And how many credit customers? (Decides how much search/filter we need.)
   **Answer** — < 500.
2. **[blocks schema]** Roles in 1.0: just Admin (owner) and Staff? Can staff
   see and edit every bill, or only their own? Who can cancel or fix a bill
   after it is saved — owner only?
   **Answer** — Admin, staff for now. All edits will be admin-only.
3. How many people will use the app at the same time? One counter machine or
   several?
   **Answer** — 2–5.
4. **[blocks schema]** When a bill is entered wrong today (paper/excel), what
   do you actually do — strike it out and write a new one, or correct the
   same one? (Decides whether bills are editable or "cancel + re-enter".)
   **Answer** — On paper bills they correct it. In the app we can decide what
   to do. Allow employees to cancel the bill, but only admin should delete
   (soft delete) the bill. In case of product sales, it should be updated to
   the stock. Soft delete or hard delete with audit trail — what's the best
   practice? Leave it up to you.

## B. Billing & sale flow

5. **[blocks schema]** Can ONE bill mix products and services (2 pens + a
   design charge on the same bill)? Or are product bills and service orders
   always separate documents?
   **Answer** — No, we will keep it separate.
6. **[blocks schema]** Selling price: fixed per product in the catalog, or
   often changed at the counter (discount, negotiation)? Do you need a
   discount field on the bill?
   **Answer** — Discount is allowed.
7. Bill identity: is an auto-generated bill number enough? Any format you
   already use (e.g., 2026-001)?
   **Answer** — You decide. Pragmatic approach, industry-wide for
   small-scale business.
8. Do you hand the customer a printed bill (thermal / A4), or is a bill
   number on screen enough for 1.0?
   **Answer** — Not required for now, but we can offload that to the browser,
   right? Cmd+P.
9. The free-form tax field: is it a tax **amount** added to the bill, or the
   shop's GST **number** printed on it, or both? Per bill or per line item?
   **Answer** — GST — free-form for tax. GST number — not for now.
10. Returns: money refunded, or adjusted against the customer's credit
    balance? Full bill only, or partial (return 1 of 3 items)? Any time limit?
    **Answer** — Depends. For a credit customer, reduce the money they owe or
    give the cash — decided at the time. Allow both. Walk-in customer — give
    the money then and there and close it.

## C. Service orders

11. **[blocks schema]** Is there a price list for services (A4 print = ₹2,
    lamination = ₹10), or is every job priced by judgment at the counter?
    **Answer** — For services, fixed prices are there, but many times an
    override can happen at the time of billing, so it can be added as a
    discount. So masters are not required for now.
12. **[blocks schema]** Service order statuses, in the words you actually
    use at the shop — e.g., "taken → working → ready → delivered"? Which ones
    do we need on screen?
    **Answer** — Your values are fine.
13. Can one service order have multiple items (100 printouts + binding +
    design on one job)?
    **Answer** — Yeah, it can have. So maybe we can have masters for easy
    fill. Later, based on the scenario at the counter, let them discount it?
    What do you think? So this answers my previous point above.
14. **[blocks schema]** Advance: any rule (like half upfront) or any amount?
    Can a customer pay more than once before delivery?
    **Answer** — No.
15. After delivery, if the balance is unpaid — should the service order
    simply show as "delivered, ₹X due" by that customer? (That is what I'd
    assume: no separate credit-bill document needed.)
    **Answer** — Yeah, status delivered, but we need to know this sale is not
    fully paid, right? You tell me — maybe later when we build services we
    will come to know? But regardless, we need to add it to their balance —
    money they owe.
16. Should the daily delivery list also show overdue jobs (promised
    yesterday, still not delivered) separately?
    **Answer** — Yes.

## D. Customers & credit

17. How do you identify a customer at the counter — phone number mainly?
    What if two people share a phone at home?
    **Answer** — Doesn't matter, it's theirs, we will club it for now.
18. Roughly how many customers owe money at any time? Do you chase them by
    looking at a list, or from memory?
    **Answer** — Right now it's chaos with paper, Excel, and some free apps.
19. **[blocks schema]** When a customer pays ₹500 against ₹2,000 owed, is
    that "just reduce their balance" (on account), or do you want to mark it
    against a specific bill? Small shops almost always use on-account. OK?
    **Answer** — "On account" means? Specific bill? For sure a separate
    audit trail is required — agree? This is separate from your question
    though.
20. Do you need a printable customer statement (all bills + payments) in
    1.0, or just the balance on screen?
    **Answer** — On screen is fine.

## E. Stock & purchases

21. **[blocks schema]** Do you want live stock quantity — deducted on every
    sale, with a low-stock warning? Or is purchase entry mainly for cost
    tracking? (Live stock is a big scope jump: stock counts, damage entries,
    corrections. Can also come in 1.1.)
    **Answer** — Live stock with low-stock warning is required. How is this
    big scope? Just deduct when we click sold, right? Damage entries /
    return to vendor not required.
22. **[blocks schema]** Cost price: same product bought at ₹10 in Oct and
    ₹12 in Nov. You sell one in Nov — what was the cost? Options: **latest
    cost** (simplest), **average cost**, or **first-in-first-out** (most
    exact, most work). Small shops usually pick latest or average.
    **Answer** — Can we introduce a batch number, price it, and sell it at
    the same price, so no confusion? While selling, automatically follow
    FIFO order too?
23. Do you need entries for damage/loss/theft, and a periodic stock-count
    correction? (If yes to live stock, these come with it.)
    **Answer** — Nope, I need it mainly for cost tracking. To get a rough
    idea, we need stock deduction, that's all. Stock correction can be
    deferred to MVP 1.1.
24. Purchase entry: one purchase = one vendor + many items + a total? Do
    you enter purchases the same day or in a batch later?
    **Answer** — Same or later too.

## F. Expenses & salary

25. **[blocks schema]** My take on salary: keep salaries as their **own**
    entry type (employee + month + amount + paid date), and let reports show
    them separately *and* rolled into total expenses. This needs a simple
    employee list in 1.0 (even without task assignment). Agree? And are
    employees monthly-salary or daily-wage?
    **Answer** — Monthly salary, and agreed to your point.
26. What expense types do you actually have — rent, electricity, supplies,
    transport…? A dozen, or a handful?
    **Answer** — Just a handful of items. Anyways we are keeping a master
    table, so fine, right?

## G. Money in / money out

27. When customers pay (cash or UPI), do you want to record the **mode**
    (cash / UPI / bank)? One small field now saves pain later, but we can
    skip it.
    **Answer** — We can add and keep as optional.
28. Purchases in 1.0 are unpaid-by-ui (vendor payments come in 1.1). Should
    the system still quietly track "we owe vendor X ₹Y" for free? (It comes
    almost free with a ledger.) Or ignore vendor dues entirely until 1.1?
    **Answer** — Your call.

## H. Practical realities

29. If the internet drops at the shop for an hour, is it acceptable that
    billing pauses? (Offline mode is a big cost. I'd say online-only for
    1.0 — confirm.)
    **Answer** — Just fail if no internet for MVP 1.0. Yes, agreed.
30. Devices: desktop browser only for 1.0? Will the owner check numbers
    from a phone even if billing is desktop-only?
    **Answer** — Owner might, so mobile-friendly web is good to have. Later
    we will have a mobile app in React Native, but until then, yeah.
31. Existing records: any old data (paper books, excel) to bring in, or do
    we start clean from day one?
    **Answer** — Nope, no old data, clean slate. Maybe only credit
    customers' current state we may enter.
32. Currency: round to the rupee, or do you need paise anywhere?
    **Answer** — Paise. So better to store as paise in DB, right? For easier
    calculations?

---

## Your three questions — my take (confirm or push back)

**Answer** — Agreed on all counts below.

### 1. How to maintain what each customer owes?

Do **not** store a balance number that gets updated. Store the events:

- every credit bill adds to what they owe,
- every payment reduces it,
- balance = sum of bills − sum of payments, computed when needed.

This is called a ledger. Why: a wrong entry is fixed by adding a correcting
entry, not by editing a number and losing history. It also gives you a
customer statement for free, and the same pattern works for vendor dues in
1.1. Walk-in sales simply have no customer attached.

### 2. Monthly numbers — what do shops usually look at?

Two different questions, two different numbers:

- **Earned this month** (profit): sales − cost of sold items − expenses,
  counted in the month the *sale happened*. A credit sale counts fully in
  its own month even if unpaid.
- **Collected this month** (cash): money that actually came in — paid bills,
  advances, and old debt repayments.

Useful usual stats: daily sales, monthly product-vs-service split, cost of
goods sold, gross profit, expenses total, net profit, cash collected vs
cash paid out, total outstanding credit ("who owes what"), pending and
overdue deliveries, top-selling items.

### 3. Old debts paid in a random month — does that count as profit?

No. The profit was already counted in the month of the *sale*. The late
payment only: (a) increases "cash collected" that month, and (b) reduces the
customer's outstanding balance. It never touches profit again. This split
(earned vs collected) is exactly how accountants handle it, and it's the
cleanest mental model for you too.

---

## Naming note (avoid future confusion)

**Answer** — Agreed on this, my bad.

- Money **customers owe us** → *receivables* / customer credit.
- Money **we owe vendors** → *payables* / vendor dues.
