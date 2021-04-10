import { Injectable } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

@Injectable()
export class BaseService {
  constructor(
    protected readonly _connection: Connection,
    protected readonly _entityManager: EntityManager,
  ) {}

  protected async getQueryRunner(isolationLevel?: IsolationLevel) {
    const queryRunner = this._connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction(isolationLevel);

    return queryRunner;
  }
}
