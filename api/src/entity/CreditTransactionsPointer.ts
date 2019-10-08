import { Base } from "./Base";
import { Entity, OneToOne, JoinColumn, PrimaryColumn, Column } from "typeorm";
import { Customer } from "./Customer";

@Entity()
export class CreditTransactionsPointer extends Base {
  @OneToOne(type => Customer, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "customerId" })
  customer: Customer;

  @PrimaryColumn() customerId: string;

  @Column() seqPointer: number;

  @Column() balanceAmount: number;
}
