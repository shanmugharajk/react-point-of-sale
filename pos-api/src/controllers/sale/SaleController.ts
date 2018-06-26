import { SalesService } from "../../services/SalesService";
import {
  JsonController,
  Authorized,
  Get,
  Post,
  Body,
  Param,
  Delete
} from "routing-controllers";
import { CurrentUser } from "../../decorators/CurrentUser";
import { TransactionDetails } from "../../entity/TransactionDetails";
import { CheckoutSale } from "../../dtos/sale";

const INVALID_TRANSACTIONID = {
  code: "INVALID_TRANSACTIONID",
  message: "invalid transaction id is sent"
};

@JsonController("/sales")
@Authorized()
export class Sale {
  constructor(private salesService: SalesService) {}

  @Get("/initTransaction")
  public initTransaction(@CurrentUser() userid: string): Promise<number> {
    return this.salesService.initTransaction(userid);
  }

  @Get("/openTransaction/:transactionId")
  public openTransaction(
    @CurrentUser() userid: string,
    @Param("transactionId") transactionId: number
  ): Promise<any> {
    if (!transactionId) {
      throw INVALID_TRANSACTIONID;
    }

    return this.salesService.openTransaction(userid, transactionId);
  }

  @Post("/:transactionId/updateCart")
  public addToCart(
    @Param("transactionId") transactionId: number,
    @Body() transactionDetails: TransactionDetails,
    @CurrentUser() userid: string
  ): Promise<any> {
    if (!transactionId) {
      throw INVALID_TRANSACTIONID;
    }

    transactionDetails.id = transactionId;
    return this.salesService.updateCart(transactionDetails, userid);
  }

  @Delete("/:transactionId/:productId")
  public removeItemFromCart(
    @Param("transactionId") transactionId: number,
    @Param("productId") productId: string
  ) {
    return this.salesService.removeItemFromCart(transactionId, productId);
  }

  @Post("/:transactionId/checkoutCounterSale")
  public checkoutCounterSale(
    @Param("transactionId") transactionId: number,
    @CurrentUser() userid: string,
    @Body() saleDetails: CheckoutSale
  ) {
    if (!transactionId) {
      throw INVALID_TRANSACTIONID;
    }

    saleDetails.transactionId = transactionId;
    return this.salesService.checkoutSale(userid, saleDetails);
  }

  @Post("/:transactionId/checkoutCreditSale")
  public checkoutCreditSale(
    @Param("transactionId") transactionId: number,
    @CurrentUser() userid: string,
    @Body() saleDetails: CheckoutSale
  ) {
    if (!transactionId) {
      throw INVALID_TRANSACTIONID;
    }

    saleDetails.transactionId = transactionId;
    return this.salesService.checkoutSale(userid, saleDetails, true);
  }
}
