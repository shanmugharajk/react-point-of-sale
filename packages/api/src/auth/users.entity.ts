import { Column, Entity, PrimaryColumn } from 'typeorm';

import { Role } from '@pos/common';
import { TimeStamps } from '@pos-api/utils';

@Entity({ name: 'users' })
export class UsersEntity extends TimeStamps {
  @PrimaryColumn({ name: 'id' })
  userId: string;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ default: Role.REGULAR_USER, type: 'int' })
  role: Role;

  @Column({ default: true })
  isActive: boolean;
}
