import { Base } from "./Base";
import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class TransactionId extends Base {
  @PrimaryColumn() id: string;

  @Column() count: number;
}
