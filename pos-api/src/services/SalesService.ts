import * as currency from "currency.js";
import { getManager, getConnection, EntityManager } from "typeorm";
import { TransactionId } from "../entity/TransactionId";
import { TransactionDetails } from "../entity/TransactionDetails";
import { Product } from "../entity/Product";
import { CheckoutSale, DeleteSale } from "../dtos/sale";
import { Customer } from "../entity/Customer";
import { CreditTransactionsPointer } from "../entity/CreditTransactionsPointer";

import {
  CreditTransactions,
  CreditTransactionsType
} from "../entity/CreditTransactions";
import {
  TransactionHeader,
  TransactionStatus,
  SalesType
} from "../entity/TransactionHeader";

import * as Messages from "./messages";

export class SalesService {
  public async initTransaction(userId: string = "admin"): Promise<number> {
    let returnId: number = null;

    const id = this.getIdPrefix();
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    // New transaction:
    await queryRunner.startTransaction();

    try {
      const count = await queryRunner.manager.count(TransactionId, { id });

      if (count > 0) {
        await queryRunner.manager.increment(TransactionId, { id }, "count", 1);

        const transactionId: TransactionId = await queryRunner.manager.findOne(
          TransactionId,
          id
        );

        returnId = Number(`${transactionId.id}${transactionId.count}`);
      } else {
        const transactionId: TransactionId = this.getNewTransactionId(userId);

        await queryRunner.manager.insert(TransactionId, transactionId);

        returnId = Number(`${id}1`);
      }

      const transactionHeader = this.getnewTransHeader(returnId, userId);

      await queryRunner.manager.insert(TransactionHeader, transactionHeader);
      await queryRunner.commitTransaction();

      return returnId;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  public async openTransaction(
    userId: string = "admin",
    transactionId: number
  ): Promise<number> {
    const transactionHeader = await this.fetchFinishedTransactionHeader(
      transactionId
    );

    if (!transactionHeader) {
      throw Messages.TRANSACTION_ID_NOT_FOUND;
    }

    transactionHeader.transactionStatus = TransactionStatus.Pending;
    transactionHeader.updatedBy = userId;

    await getManager().save(transactionHeader);

    return transactionId;
  }

  public async updateCart(
    cartItem: TransactionDetails,
    userId: string = "admin"
  ): Promise<any> {
    const transactionHeader = await this.fetchInProcessTransactionHeader(
      cartItem.id
    );

    if (!transactionHeader) {
      throw Messages.TRANSACTION_ID_NOT_FOUND;
    }

    const product = await getManager().findOne(Product, {
      id: cartItem.productId
    });

    // Check the entered price is correct or not.
    const isValidPrice =
      currency(product.sellingPrice)
        .multiply(cartItem.qty)
        .subtract(cartItem.discount).value === cartItem.price;

    if (isValidPrice === false) {
      throw Messages.INVALID_PRICE;
    }

    cartItem.sellingPrice = currency(product.sellingPrice).multiply(
      cartItem.qty
    ).value;
    cartItem.costPrice = currency(product.costPrice).multiply(
      cartItem.qty
    ).value;
    cartItem.createdBy = userId;
    cartItem.updatedBy = userId;

    await getManager().save(cartItem);

    transactionHeader.transactionStatus = TransactionStatus.Pending;

    await getManager().save(transactionHeader);

    return Messages.ADDED_TO_CART;
  }

  public async removeItemFromCart(id: number, productId: string) {
    const transactionHeader = this.fetchInProcessTransactionHeader(id);

    if (!transactionHeader) {
      throw Messages.TRANSACTION_ID_NOT_FOUND;
    }

    return await getManager().delete(TransactionDetails, {
      id,
      productId
    });
  }

  public async emptyCart(transactionId: number): Promise<any> {
    const transactionHeader = await this.fetchInProcessTransactionHeader(
      transactionId
    );

    if (!transactionHeader) {
      throw Messages.TRANSACTION_ID_NOT_FOUND;
    }

    await getManager()
      .createQueryBuilder()
      .delete()
      .from(TransactionDetails)
      .where("id = :id", { id: transactionId })
      .execute();

    return Messages.CART_EMPTIED;
  }

  public async deleteSale(
    userId: string = "admin",
    saleDetails: DeleteSale
  ): Promise<any> {
    const transactionHeader = await this.fetchFinishedTransactionHeader(
      saleDetails.transactionId
    );

    if (!transactionHeader) {
      throw Messages.TRANSACTION_ID_NOT_FOUND;
    }

    if (transactionHeader.salesType === SalesType.CounterSale) {
      return await this.deleteCounterSale(saleDetails.transactionId);
    } else {
      return await this.deleteCreditSale(userId, saleDetails);
    }
  }

  public async checkoutSale(
    userId: string = "admin",
    saleDetails: CheckoutSale,
    isCreditSale: boolean = false
  ): Promise<any> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    // New transaction:
    await queryRunner.startTransaction();

    try {
      if (isCreditSale === true) {
        saleDetails.saleType = SalesType.CreditSale;
        await this.saveCreditSale(queryRunner.manager, userId, saleDetails);
      } else {
        saleDetails.saleType = SalesType.CounterSale;
        await this.saveSale(queryRunner.manager, userId, saleDetails);
      }

      queryRunner.commitTransaction();

      return Messages.SALE_COMPLETED_SUCCESS;
    } catch (error) {
      queryRunner.rollbackTransaction();
      throw error;
    }
  }

  private async deleteCreditSale(
    userId: string,
    saleDetails: DeleteSale
  ): Promise<any> {
    const { transactionId, amountPaid, customerId } = saleDetails;

    const transactionHeader = await this.fetchFinishedTransactionHeader(
      transactionId
    );

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    // New transaction:
    await queryRunner.startTransaction();

    try {
      const previousTransaction = await queryRunner.manager.findOne(
        CreditTransactions,
        {
          customerId,
          transactionId,
          isReverted: false
        }
      );

      const pointer = await queryRunner.manager.findOne(
        CreditTransactionsPointer,
        { customerId }
      );

      if (!previousTransaction || !pointer) {
        throw Messages.NO_DATA_FOUND;
      }

      // To cross verify the pointer table has the latest update on customer.
      await this.verifyTheBalanceIsLatest(queryRunner.manager, pointer);

      //===========================
      // Current CreditTransaction
      //===========================
      const current = new CreditTransactions();
      current.customerId = saleDetails.customerId;
      current.amountPaid = previousTransaction.billAmount;
      current.balance = 0;
      current.billAmount = previousTransaction.billAmount;
      current.transactionId = previousTransaction.transactionId;
      current.totalDebt = currency(pointer.balanceAmount)
        .subtract(currency(previousTransaction.billAmount))
        .add(amountPaid).value;
      current.isReverted = false;
      current.paidDate = new Date();
      current.type = CreditTransactionsType.SaleRevertPayment;
      current.createdBy = userId;
      current.updatedBy = userId;

      const res = await queryRunner.manager.save(current);

      //==========================
      // CreditTransactionsPointer
      //==========================
      pointer.seqPointer = res.id;
      pointer.updatedBy = userId;
      pointer.balanceAmount = current.totalDebt;

      await queryRunner.manager.save(pointer);

      //===========================
      // Previous CreditTransaction
      //===========================
      previousTransaction.isReverted = true;
      previousTransaction.updatedBy = userId;

      await queryRunner.manager.save(previousTransaction);

      //==========================
      // TransactionHeader
      //==========================
      transactionHeader.isActive = false;

      await queryRunner.manager.save(transactionHeader);

      queryRunner.commitTransaction();

      return Messages.SALE_DELETED;
    } catch (error) {
      queryRunner.rollbackTransaction();
      throw error;
    }
  }

  private async deleteCounterSale(id: number): Promise<any> {
    await getManager()
      .createQueryBuilder()
      .delete()
      .from(TransactionDetails)
      .where("id = :id", { id })
      .execute();

    return Messages.SALE_DELETED;
  }

  private async saveCreditSale(
    manager: EntityManager,
    userId: string,
    saleDetails: CheckoutSale
  ): Promise<any> {
    const count = await manager.count(Customer, { id: saleDetails.customerId });

    if (count !== 1) {
      throw Messages.INVALID_CUSTOMER;
    }

    const { billAmount, amountPaid } = await this.saveSale(
      manager,
      userId,
      saleDetails
    );

    const currentBalance = currency(billAmount).subtract(amountPaid).value;

    const currentTransaction = new CreditTransactions();
    currentTransaction.customerId = saleDetails.customerId;
    currentTransaction.amountPaid = amountPaid;
    currentTransaction.billAmount = billAmount;
    currentTransaction.isReverted = false;
    currentTransaction.type = CreditTransactionsType.Sale;
    currentTransaction.paidDate = new Date();
    currentTransaction.createdBy = userId;
    currentTransaction.updatedBy = userId;
    currentTransaction.transactionId = saleDetails.transactionId;
    currentTransaction.balance = currentBalance;

    const previousTransaction = await manager.findOne(CreditTransactions, {
      customerId: saleDetails.customerId,
      transactionId: saleDetails.transactionId,
      isReverted: false
    });

    let pointer = await manager.findOne(CreditTransactionsPointer, {
      customerId: saleDetails.customerId
    });

    // To cross verify the pointer table has the latest update on customer.
    await this.verifyTheBalanceIsLatest(manager, pointer);

    // CASE :
    // No previous credit transaction and new sale entry.
    if (!pointer && !previousTransaction) {
      currentTransaction.totalDebt = currentBalance;
    }

    // CASE :
    // Has previous credit transaction and new sale entry.
    if (pointer && !previousTransaction) {
      currentTransaction.totalDebt = currentBalance + pointer.balanceAmount;
    }

    // CASE :
    // Has previous credit transaction and updating existing sale.
    if (pointer && previousTransaction) {
      const previousBalance = await this.revertThePreviousCreditTransaction(
        manager,
        previousTransaction,
        pointer.balanceAmount,
        userId
      );

      currentTransaction.totalDebt = currentBalance + previousBalance;
      previousTransaction.isReverted = true;

      // Reverting the old transaction.
      await manager.save(CreditTransactions, previousTransaction);
    }

    const res = await manager.save(CreditTransactions, currentTransaction);

    if (!pointer) {
      pointer = new CreditTransactionsPointer();
      pointer.createdBy = userId;
      pointer.customerId = saleDetails.customerId;
    }
    pointer.balanceAmount = currentTransaction.totalDebt;
    pointer.seqPointer = res.id;
    pointer.updatedBy = userId;

    await manager.save(CreditTransactionsPointer, pointer);
  }

  private async revertThePreviousCreditTransaction(
    manager: EntityManager,
    previousCreditTransaction: CreditTransactions,
    currentDebt: number,
    userId: string
  ): Promise<number> {
    const ct = new CreditTransactions();
    ct.customerId = previousCreditTransaction.customerId;
    ct.amountPaid = currency(previousCreditTransaction.billAmount).subtract(
      previousCreditTransaction.amountPaid
    ).value;
    ct.balance = 0;
    ct.totalDebt = currency(currentDebt).subtract(ct.amountPaid).value;
    ct.createdBy = userId;
    ct.updatedBy = userId;
    ct.isReverted = true;
    ct.type = CreditTransactionsType.SaleRevertPayment;
    ct.paidDate = new Date();

    await manager.save(CreditTransactions, ct);

    return ct.totalDebt;
  }

  // This is to check the pointer table has the latest. Currently we are throwing exception.
  // TODO : Instead exception handle it.
  private async verifyTheBalanceIsLatest(
    manager: EntityManager,
    pointer?: CreditTransactionsPointer
  ): Promise<boolean> {
    if (!pointer) {
      return true;
    }

    const count = await manager
      .createQueryBuilder(CreditTransactions, "ct")
      .where("ct.id >= :id", { id: pointer.seqPointer })
      .getCount();

    if (count !== 1) {
      throw Messages.BALANCE_MISMATCH;
    }
    return true;
  }

  private async saveSale(
    manager: EntityManager,
    userId: string,
    saleDetails: CheckoutSale
  ): Promise<TransactionHeader> {
    const transactionHeader = await this.fetchInProcessTransactionHeader(
      saleDetails.transactionId
    );

    if (!transactionHeader) {
      throw Messages.TRANSACTION_ID_NOT_FOUND;
    }

    let { totalPrice, totalDiscount, netTotalPrice } = await manager
      .createQueryBuilder(TransactionDetails, "td")
      .select("SUM(td.price)", "totalPrice")
      .addSelect("SUM(td.sellingPrice)", "netTotalPrice")
      .addSelect("SUM(td.discount)", "totalDiscount")
      .where("td.id = :id", { id: saleDetails.transactionId })
      .getRawOne();

    totalPrice = currency(totalPrice).value;
    netTotalPrice = currency(netTotalPrice).value;
    totalDiscount = currency(totalDiscount).value;

    transactionHeader.transactionStatus = TransactionStatus.Done;
    transactionHeader.taxPercentageString = saleDetails.taxPercentageString;
    transactionHeader.tax = saleDetails.tax;
    transactionHeader.discountOnTotal = currency(
      saleDetails.totalDiscount
    ).value;
    transactionHeader.discountOnItems = totalDiscount;
    // Total of all products without any discount or tax.
    transactionHeader.netAmount = currency(netTotalPrice).value;
    // Total of netAmount + tax + discount.
    transactionHeader.billAmount = currency(totalPrice)
      .add(saleDetails.tax)
      .subtract(saleDetails.totalDiscount).value;

    transactionHeader.amountPaid = currency(saleDetails.amountPaid).value;
    transactionHeader.updatedBy = userId;
    transactionHeader.salesType = saleDetails.saleType;

    return manager.save(transactionHeader);
  }

  // UTILITY METHODS
  private async fetchInProcessTransactionHeader(
    cartItemId: number
  ): Promise<TransactionHeader> {
    return await getManager()
      .createQueryBuilder(TransactionHeader, "th")
      .where(
        "th.id = :id AND isActive = 1 AND th.transactionStatus NOT IN (2)",
        {
          id: cartItemId,
          status: [TransactionStatus.Done]
        }
      )
      .getOne();
  }

  private async fetchFinishedTransactionHeader(
    cartItemId: number
  ): Promise<TransactionHeader> {
    return await getManager()
      .createQueryBuilder(TransactionHeader, "th")
      .where(
        "th.id = :id AND isActive = 1 AND th.transactionStatus IN (:...status)",
        {
          id: cartItemId,
          status: [TransactionStatus.Done]
        }
      )
      .getOne();
  }

  private getnewTransHeader(
    id: number,
    userId: string,
    salesType: SalesType = SalesType.CounterSale
  ): TransactionHeader {
    const transactionHeader = new TransactionHeader();
    transactionHeader.id = id;
    transactionHeader.billAmount = 0;
    transactionHeader.discountOnItems = 0;
    transactionHeader.discountOnTotal = 0;
    transactionHeader.netAmount = 0;
    transactionHeader.amountPaid = 0;
    transactionHeader.tax = 0;
    transactionHeader.taxPercentageString = "";
    transactionHeader.salesType = salesType;
    transactionHeader.transactionStatus = TransactionStatus.Init;
    transactionHeader.createdBy = userId;
    transactionHeader.updatedBy = userId;
    transactionHeader.isActive = true;

    return transactionHeader;
  }

  private getNewTransactionId(userId: string): TransactionId {
    const id = this.getIdPrefix();

    const transactionId = new TransactionId();
    transactionId.id = id;
    transactionId.count = 1;
    transactionId.createdBy = userId;
    transactionId.updatedBy = userId;

    return transactionId;
  }

  private getIdPrefix(): string {
    const date: Date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const strDay = day.toString().length > 1 ? day : `0${day}`;
    const strMonth = month.toString().length > 1 ? month : `0${month}`;

    return `${year}${strMonth}${strDay}`;
  }
}
