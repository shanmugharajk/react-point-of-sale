# Discovery — round 2 (archived interview)

> **Archive.** Questions with inline answers, kept as the "why" behind
> decisions. The agreed outcomes live in [`decisions.md`](../decisions.md);
> anything still open moved to [`round-3-research-and-close.md`](round-3-research-and-close.md).

Born from round-1 answers. Most were quick confirms of my earlier
recommendations, then marked **[r2]** in
[`decisions.md`](../decisions.md) — all since folded in and confirmed.

---

1. (D16/D17) Service orders: every order gets a real customer record —
   found by mobile, auto-created if new. And name + mobile stay mandatory
   even when the job is fully paid in advance. My lean: **yes to both** —
   it's what makes "delivered, ₹X due" land on someone's balance, and it
   gives you service history per customer for free.
   **Answer** — Yes.

2. (D18) More than one payment before delivery — allowed? My lean: **yes**.
   With the ledger it costs nothing extra.
   **Answer** — Yes.

3. (D33) Costing check, in one line: cost price lives on the purchase
   batch; a sale consumes batches oldest-first (FIFO); selling price lives
   on the product and is changed only by discount. **No per-batch selling
   price.** Correct?
   **Answer** — I ask you back: if we have selling price per batch, would
   that be simpler and more accurate? Else, if it is on the product — e.g.,
   ₹10 on the product, but the price increased in the current batch to ₹12 —
   then we need to update it. Then we don't know, in the sales, exactly at
   which price we sold the product.

4. (D22) Service catalog — you asked what I think: include a small one in
   1.0 (name + default price, overridable at the counter as a discount).
   Typing "lamination" every day invites typos and price inconsistency.
   Include, or keep 1.0 master-free?
   **Answer** — Yes.

5. (D13) Returns: only against a bill that exists in the system? Or also
   "no bill" returns for regulars? My lean: **only against a bill** — keeps
   stock and ledger clean.
   **Answer** — Yes.

6. (D38) Product master: do your products carry barcodes worth scanning at
   the counter? And an optional category field for < 500 products, or is
   name-search enough? My lean: no barcode scanning in 1.0; category as an
   optional field, cheap.
   **Answer** — But barcode scanning is a device job, and in the end our
   textbox gets a unique identifier and we scan against it, right?

7. (D31) Low stock: per-product editable threshold (default, say, 5)? Or
   one shop-wide number? My lean: **per-product with a default** — some
   items sell fast, some never.
   **Answer** — Yes, per product.

8. (D28) One shared balance per customer across product bills **and**
   service orders — so a ₹500 payment just reduces the total, whatever it
   covers. Confirm?
   **Answer** — Yeah, right. Unless you disagree for any design issue.

9. Free-text **note** line on bills and service orders ("refer to XYZ",
   "urgent", customer instructions)? Paper receipts usually carry these and
   counter staff will ask for it. Cheap now, retrofit is annoying.
   **Answer** — OK, to add.

10. Salary month: paid for a calendar month (November salary), with an
    optional "paid on" date that may fall in the next month. Right? And any
    advance/loan-to-employee scenarios we should keep the door open for?
    **Answer** — Let's keep the door open.
