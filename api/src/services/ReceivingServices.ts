import { getConnection } from "typeorm";
import { CrudServices, IFetchPageQuery } from "./CrudServices";
import { Receiving } from "../entity/Receiving";
import { Stock } from "../entity/Stock";

export class ReceivingServices {
  private crudServices: CrudServices<Receiving>;

  constructor() {
    this.crudServices = new CrudServices<Receiving>();
    this.crudServices.setEntity(Receiving);
  }

  public async create(userId: string, receiving: Receiving) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    // New transaction:
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.insert(Receiving, receiving);
      await queryRunner.manager.increment(
        Stock,
        { id: receiving.product.id },
        "count",
        receiving.qty
      );
      // commit transaction.
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  public async fetchPages(query: IFetchPageQuery): Promise<Receiving[]> {
    return await this.crudServices.fetchPages(query);
  }

  public async fetchById(id: string | number): Promise<Receiving> {
    return await this.crudServices.fetchById(id);
  }

  public async deleteById(id: string): Promise<any> {
    return await this.crudServices.deleteById(id);
  }

  public async updateById(
    userId: string = "admin",
    where: object,
    data: any
  ): Promise<any> {
    return await this.crudServices.updateById(userId, where, data);
  }
}
