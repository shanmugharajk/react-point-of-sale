# Transaction flow

## Create a transaction id

1. Generate the unique id => yyyymmddss -> elixir unix timestamps.
2. ~~Check the trasaction id table and get the [count]~~
3. Make a default entry in the TransactionHeader table with status **INPROGRESS**

## Add item from cart

1. Adds the product to the TransactionDetail table.
2. Accept the -ve and subtract from the qty
3. If qty = 0 delete the record from the TransactionDetail table.

## Remove item from cart

1. Delete the record from the TransactionDetail table.

## Checkout counter sale

1. Get the details from the TransactionDetail table and do the calculations and
   update the TransactionHeader table and update the status as **DONE**

## Checkout credit sale

1. Verify the customer exists

2. Do the same process as counter sale - save TransactionDetail -> TransactionHeader ..etc..

3. Form the CrediTransaction details find the current transaction

4. Fetch the previous CreditTransactions, CreditTransactionPointer

5. Verify the pointer -> is updated
   count === 1 for -> ([id => CreditTransactionPointer] >= [id => CreditTransactions])
   else balance mismatch.

6. Cases

   _No previous transaction, this is the first credit sale_
   if: previous [!CreditTransactions]
   update the current sale

   _Has previous transaction_
   if: previous [CreditTransactions]
   calculate the balance from the previous [CreditTransactions] and update the current

   update the pointer also.

| Action              | TransId | BillAmount | Paid : | Balance | TotalDebt | IsReverted |                 Type |
| ------------------- | :------ | :--------- | -----: | ------: | --------: | ---------: | -------------------: |
| Credit Sale         | 600     | 200₹       |   100₹ |    100₹ |      100₹ |      false |          CREDIT_SALE |
| Credit Sale         | 900     | 800₹       |   100₹ |    700₹ |      800₹ |      false |          CREDIT_SALE |
| Revert Sale Partial | 600     | 0₹         |     0₹ |   -200₹ |      600₹ |       true |  SALE_REVERT_PARTIAL |
| Amount Payment      | 1000    | 0₹         |   200₹ |  -2000₹ |      400₹ |      false | CREDIT_price_PAYMENT |

## Credit payment

## Return sale

## Revert the total sale
