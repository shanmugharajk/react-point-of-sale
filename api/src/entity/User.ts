import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { IsNotEmpty, IsEnum } from "class-validator";

export enum Role {
  Admin,
  NonAdmin
}

@Entity()
export class User {
  @IsNotEmpty()
  @PrimaryColumn()
  id: string;

  @IsNotEmpty()
  @Column()
  name: string;

  @IsNotEmpty()
  @Column()
  password: string;

  @IsEnum(Role)
  @Column()
  role: Role;

  @IsNotEmpty()
  @CreateDateColumn()
  createdAt: Date;

  @IsNotEmpty()
  @UpdateDateColumn()
  updatedAt: Date;
}
