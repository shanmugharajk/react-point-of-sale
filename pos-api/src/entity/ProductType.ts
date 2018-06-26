import { Entity, Column, PrimaryColumn } from "typeorm";
import { Base } from "./Base";
import { IsPositive } from "class-validator";

@Entity()
export class ProductType extends Base {
  @IsPositive()
  @PrimaryColumn()
  id: string;

  @IsPositive()
  @Column()
  description: string;
}
