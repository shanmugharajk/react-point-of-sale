import { IsNumber, Min, IsNotEmpty } from "class-validator";
import { SalesType } from "../entity/TransactionHeader";

export class CheckoutSale {
  transactionId: number;

  @IsNumber()
  @Min(0)
  totalDiscount: number;

  @Min(0)
  @IsNumber()
  tax: number;

  @IsNotEmpty() taxPercentageString: string;

  customerId?: string;

  @IsNumber()
  @Min(0)
  amountPaid: number;

  saleType: SalesType;
}

export class DeleteSale {
  transactionId: number;

  @IsNumber()
  @Min(0)
  amountPaid: number;

  customerId?: string;
}
