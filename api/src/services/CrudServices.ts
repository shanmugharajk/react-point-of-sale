import { getManager, InsertResult, UpdateResult } from "typeorm";

export interface IFetchPageQuery {
  search: string;
  perPage: number;
  page: number;
}

export class CrudServices<T> {
  protected classType: new () => T;

  protected alias: string;

  setEntity(classType: new () => T) {
    this.classType = classType;
    this.alias = this.classType.name.toLowerCase();
  }

  public async fetchAll() {
    return await getManager().find(this.classType);
  }

  public async fetchPages(query: IFetchPageQuery) {
    const recordsToSkip = (query.page - 1) * query.perPage;

    if (query.search) {
      return await getManager()
        .createQueryBuilder(this.classType, this.alias)
        .where(`${this.alias}.id like :id`, { id: `%${query.search}%` })
        .skip(recordsToSkip)
        .take(query.perPage)
        .getMany();
    } else {
      return await getManager()
        .createQueryBuilder(this.classType, this.alias)
        .skip(recordsToSkip)
        .take(query.perPage)
        .getMany();
    }
  }

  public async fetchById(id: string | number) {
    return await getManager()
      .createQueryBuilder(this.classType, this.alias)
      .where(`${this.alias}.id = :id`, { id })
      .getOne();
  }

  public async create(userId: string = "admin", entity: T): Promise<any> {
    (entity as any).createdBy = userId;
    (entity as any).updatedBy = userId;
    return await getManager().insert(this.classType, entity);
  }

  public async updateById(
    userId: string = "admin",
    where: object,
    data: any
  ): Promise<any> {
    try {
      data.updatedBy = userId;
      data.id = (where as any).id;
      return await getManager().update(this.classType, { ...where }, data);
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT" && error.errno === 19) {
        throw {
          code: "SQLITE_CONSTRAINT",
          message: `This record can't be updated since it has references with other parts of data. Please ensure that those are deleted and try this operation`
        };
      }
      throw error;
    }
  }

  public async deleteById(id: string): Promise<any> {
    try {
      return await getManager().delete(this.classType, id);
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT" && error.errno === 19) {
        throw {
          code: "SQLITE_CONSTRAINT",
          message: `This record can't be deleted since it has references with other parts of data. Please ensure that those are deleted and try this operation`
        };
      }
      throw error;
    }
  }
}
