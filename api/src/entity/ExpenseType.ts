import { Entity, Column, PrimaryColumn } from "typeorm";
import { Base } from "./Base";
import { IsNotEmpty } from "class-validator";

@Entity()
export class ExpenseType extends Base {
  @IsNotEmpty()
  @PrimaryColumn()
  id: string;

  @IsNotEmpty()
  @Column()
  description: string;
}
