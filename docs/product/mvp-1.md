# MVP 1.0: scope and money rules

Agreed with the shop owner on 2026-11-13. Update this file when the product rules change.

## Who and what
One shop. Users are the owner (admin) and employees, all with logins. No payment gateway, no cash drawer, no tax reference data. Reports come after all the data entry screens work.

## Modules
- **Sales**: product bills (from stock) and service orders (separate thing).
- **Reference data** (admin): product types, products, service types, vendors, customers, expense types. Every product has exactly one product type, used only for grouping in reports; sales pick a product by searching it directly. Service types are a small list (name plus usual price) picked at billing, with the price editable per order.
- **Customers**: walk-in (nothing required) or registered (name and mobile required; address and email optional).
- **Purchases**: receive stock from a vendor; each product on a receipt is one batch with its own cost price.
- **Expenses**: expense types are reference data, admin only. Salary and advances live in their own table and count as expenses in reports.
- **Audit log**: see below.

## Rules
- **Stock is by batch.** Each product on a receipt is a batch with its own cost price and its own selling price, both typed at stock entry (the selling price starts from the product's price). The product keeps a default price only to prefill that screen.
- **Billing picks the batch by hand.** Scan or search a product, and the screen lists its batches with price and quantity left. The cashier matches the price on the pack and taps the batch. If only one batch has stock, it is picked automatically. Each bill item is one batch, so profit is exact. For a quantity that needs two batches, the cashier adds two items. A return puts stock back in the batch it came from.
- **Stock entry price check.** If the typed selling price is far from the product's previous batch price, the screen asks to confirm before saving.
- **Fixing stock mistakes.** A receipt with no sales can be cancelled and re-entered; cancelling sets its batches' quantity left to zero in the same transaction, and those batches can no longer be sold or adjusted. Once any of it is sold, quantity mistakes are fixed with a stock adjustment (lost, damaged, miscounted, typo), with a reason. Admin can correct a batch's cost price, logged. Bill items read cost from their batch, so profit follows the corrected cost.
- **A bill is frozen when saved.** Each bill item saves the quantity and the price actually charged, and the bill saves its totals. Changing a batch's selling price later affects only future sales, and customer balances never move. The only way to undo a bill is to cancel it.
- **Below-cost price** on a bill item shows a warning but is allowed.
- **No selling without stock.** A bill item cannot take more than its batch has left, and a product with no stock cannot be sold. Enter the stock receipt first.
- **One barcode per product.** A barcode finds the product, never the batch.
- **Whole numbers only** for quantities.
- **Bills and service orders are separate.** No mixing.
- **Payment at billing.** A walk-in customer must pay the full amount at billing, otherwise no sale. Only a registered customer can buy on credit, paying any amount from zero to the full total.
- **Bill numbers** run in one sequence, never restart, and a cancelled bill keeps its number.
- **Price is editable per bill item.** One discount amount per bill. One free-form "tax / extra charges" amount per bill, added to the total.
- **Returns**: refund cash or reduce the customer's balance (chosen each time). Stock goes back. A return is worth what was charged for those items, less their share of the bill discount, and a bill's returns never add up to more than its total. A return made by mistake can be cancelled only while its batches still have that stock; cancelling takes the stock back out.
- **Cancelling a bill or service order.** A bill with any return that is not cancelled can't be cancelled; return the remaining items instead. Cancelling a bill puts all its items back in the batches they came from. The cash handed back is recorded, from zero up to what was paid on it (payments taken on that bill or order, not later general payments). For a registered customer the rest stays as credit and lowers their balance. A walk-in has no balance, so they always get back everything they paid.
- **No hard deletes.** Bills, payments, purchases, expenses and salaries are cancelled with a reason and stay visible. Products, customers, vendors and expense types are marked inactive. Saved bills are never edited; cancel and re-create.
- **Walk-in service orders** need a name or mobile (so we can call when ready).
- **Service status**: Received, In progress, Ready, Delivered, Cancelled. The assignee is optional. The daily delivery list is orders due that day and not yet delivered or cancelled.
- **Roles**: employees bill, take service orders and update service status. Admin also does stock, prices, customers, expenses, salaries, cancellations, reports and the audit screen.

## Credit and payments
- A customer's balance is never stored. It is opening balance, plus bills and service orders, minus returns and payments, plus cash refunded, all calculated from those lists. Cancelled bills, orders, returns and payments do not count, but the cash handed back when cancelling a bill or order does.
- Customers who already owe money when we start get an opening balance, entered by admin and logged.
- A payment belongs to a customer, with an optional payment mode label (cash, UPI, card, other). It is not tied to a specific bill; it only records the bill or order it was taken on, which sets the most a cancel can refund.
- A service order counts as billed from the day it is taken, like a bill. The advance is its first payment; the rest is paid at delivery or later.
- Cancelling or returning a bill changes what the customer was billed, so the balance follows.
- No credit limit in 1.0.

## Reports (planned, built later)
- **Sales** is the total of bills and service orders taken in the month. **Profit** is what bills actually charged (after the discount, minus returns) minus batch cost on products, plus the charge on services, minus all expenses and salaries.
- **Pending** is the total still owed by all registered customers today (the sum of balances above zero; credit customers hold is not subtracted), shown next to profit.
- **Money collected** is shown separately and includes old debts paid that month. Old debts are never added to profit again, so nothing is counted twice.

## Audit log
- One append-only `audit_log` table: who, when, what happened, which record, and a short before/after of changed fields.
- Written by the service layer in the same transaction as the change, so a change cannot happen without its row.
- Covers bills, payments, service orders and status changes, stock receipts, expenses, salaries, cancellations, and price and reference data edits. Not page views.
- Admin gets a read-only screen. Rows are never edited or deleted.

## Not in 1.0 (planned 1.1)
- Paying vendors fully or partially and tracking what we owe them. Purchases record cost only for now.
- Task assignment for employees beyond the optional service assignee.

## Build checklist
Tick a step only after clicking through its "done when" in the running app.

- [x] 1. Foundation: all tables exist and the audit log helper works. Done when: a test change writes a row to `audit_log` in the same transaction.
- [ ] 2. Products, vendors and stock receipts. Done when: I receive the same product at two prices and see two batches. Opening stock is entered the same way, with the vendor optional.
- [ ] 3. Customers. Done when: I can add a registered customer, and a walk-in needs nothing.
- [ ] 4. Product sales. Done when: I make a credit bill with a partial payment, see the balance, and the batch is picked by hand (or automatically when only one has stock).
- [ ] 5. Returns and cancellations. Done when: a return puts stock back in its batch, and a cancelled bill puts its stock back, disappears from totals but stays visible.
- [ ] 6. Service orders. Done when: I take an order with an advance and a due date, assign it, and see it on today's delivery list until delivered.
- [ ] 7. Customer payments. Done when: an opening balance can be entered for customers who already owe money, a later payment lowers the balance and the customer page shows every bill and payment.
- [ ] 8. Expenses and salaries. Done when: admin adds an expense type, an expense and a salary payment; employees cannot see them.
- [ ] 9. Audit screen. Done when: admin sees who did each change above, and nobody can edit or delete a row.
- [ ] 10. UI polish. Done when: layout, navigation, tables, forms and empty states look consistent on every screen, and each screen works at phone width.
- [ ] 11. Reports (only after 1-10). Done when: a month shows sales, profit, pending and money collected, and old debts are not counted as profit twice.
