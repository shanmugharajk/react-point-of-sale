import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { HashingService } from '@pos-api/utils';

import { UsersEntity } from './users.entity';

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<UsersEntity> {
  listenTo() {
    return UsersEntity;
  }

  beforeInsert(event: InsertEvent<UsersEntity>): void {
    if (event.entity.password) {
      event.entity.password = HashingService.generateHash(
        event.entity.password,
      );
    }
  }

  beforeUpdate(event: UpdateEvent<UsersEntity>): void {
    if (event.entity?.password !== event.databaseEntity?.password) {
      event.entity.password = HashingService.generateHash(
        event.entity.password,
      );
    }
  }
}
