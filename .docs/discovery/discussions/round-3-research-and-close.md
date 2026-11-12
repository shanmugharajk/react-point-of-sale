# Discovery — round 3 (archived interview)

> **Archive.** Questions with inline answers, kept as the "why" behind
> decisions. The agreed outcomes live in [`decisions.md`](../decisions.md).
> The external research done for Q1 is kept as references at the bottom.

Short round. Two round-2 answers asked a question back — answered here —
plus three gaps found while folding answers in. All five settled;
discovery closed.

---

1. (D34) Selling price per batch — **revised after research**. You pushed
   back with the MRP point (Britannia biscuit: MRP printed on the packet,
   different between batches). I checked how POS systems handle it: Indian
   POS software (Marg, myBillBook, Vyapar) carries **MRP + selling rate
   per batch** — exactly for this case. Pharmacies get it fully automatic
   because drug barcodes encode the batch; a normal FMCG barcode doesn't,
   so we default to the oldest-batch price and allow override. Revised
   design: each purchase batch holds qty + unit cost + **its own selling
   price / MRP** (blank inherits the product's current price); counter
   default price = oldest batch with stock; line price overridable (the
   printed MRP is the authority); every bill line stores the actual price
   and the batch consumed, so revenue and cost are exact per line.
   Confirm?
   **Answer** — Yeah

2. (D38) Your barcode question — yes, exactly: the scanner is just a
   keyboard. It "types" the code into the product search box and presses
   Enter; we find the product by matching a barcode field. So: optional
   barcode field on the product master, counter search matches name **or**
   barcode, no special hardware support needed. Include in 1.0?
   **Answer** — Yeah

3. (D50) Day one: the system starts clean, but the shelf isn't empty in
   real life. Load current stock as one **opening stock** entry per product
   (product + qty + unit cost, no vendor) — it becomes the first FIFO
   batch. My lean: **yes** — keeps vendors clean, seeds live stock and
   cost in one move.
   **Answer** — Yeah

4. (D51) Staff powers beyond billing: staff can create a customer at the
   counter (credit and service orders need it), but everything master-ish —
   products, service catalog, vendors, purchases — plus expenses, salaries
   and reports pages stay **admin-only** (staff can't even see them).
   Confirm?
   **Answer** — Yeah, right. But this as progress also we can decide right?

5. (D40) Salary: one entry per employee per calendar month (November
   salary), with a "paid on" date that may fall in the next month. You
   didn't object in round 2 — final confirm. Employee advance/loan: door
   open, no UI in 1.0.
   **Answer** — Yeah, that's fine. Its a free field admin will select any date.
   The validation is his responsibility.

---

## References

Research done for Q1 (selling price per batch), 2026-11-11. All five
informed D34 in [`decisions.md`](../decisions.md).

- [Marg ERP — batch/size/MRP tracking per item master](https://care.margcompusoft.com/margerp/inventory-master/3318/1/How-to-enable-disable-Batch,Size,MRP,Ref-on) —
  the most common Indian retail/pharma software tracks MRP, purchase rate
  and sale rate **per batch**, with batch-wise stock and price-difference
  reports.
- [MargBooks — MRP-wise billing with batch tracking](https://margbooks.com/blogs/mrp-wise-billing-batch-tracking-price-control) —
  names our exact problem: manufacturers revise MRPs, stock arrives in
  waves, and mixed batches cause pricing errors. Also the source for the
  pharmacy detail: drug-pack barcodes encode the batch, so pricing is
  automatic there; a normal FMCG barcode does not.
- [myBillBook — batch tracking with per-batch rates](https://mybillbook.in/blog/medical-invoicing-software-with-batch-tracking) —
  purchase rate, MRP and selling rate recorded per batch; a sale consumes
  the selected batch's quantity.
- [Vyapar — batches with expiry, mfg date and MRP](https://vyaparapp.in/guides/how-to-add-item-batches-serial-numbers-in-vyapar) —
  MRP per batch in the small-business app closest to our scale.
- [SAP Community — old stock keeps old price via a different barcode](https://community.sap.com/t5/enterprise-resource-planning-q-a/how-to-get-the-old-price-in-sales-order/qaq-p/9735512) —
  how large retailers separate old-price stock; the enterprise version of
  the same idea.
