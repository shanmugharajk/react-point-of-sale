import { openConnection } from "../persistence";
import { Product } from "../entity/Product";
import { getManager } from "typeorm";

export class Queries {
  public static async run() {
    await openConnection();
    await Queries.fetchProduct();
  }

  private static async fetchProduct() {
    const product = await getManager().findOne(Product, {
      relations: ["productType"]
    });

    console.log(product);
    console.log(product.productType);
  }
}
