import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class TimeStamps {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
