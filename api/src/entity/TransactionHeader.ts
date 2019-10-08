import { Base } from "./Base";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  OneToMany,
  RelationId
} from "typeorm";
import { Customer } from "./Customer";

import { TransactionDetails } from "./TransactionDetails";

export enum SalesType {
  CreditSale,
  CounterSale
}

export enum TransactionStatus {
  Init,
  Pending,
  Done
}

@Entity()
export class TransactionHeader extends Base {
  @PrimaryColumn() id: number;

  @OneToMany(
    type => TransactionDetails,
    datasource => datasource.transactionHeader,
    { onUpdate: "CASCADE", onDelete: "RESTRICT" }
  )
  transactionDetails: TransactionDetails[];

  @Column({ type: "float" })
  discountOnItems: number;

  @Column({ type: "float" })
  discountOnTotal: number;

  @Column({ type: "float" })
  tax: number;

  @Column({ nullable: true })
  taxPercentageString: string;

  // Total of netAmount + tax + discount.
  @Column({ type: "float", default: 0 })
  billAmount: number;

  // Total of all products without any discount or tax.
  @Column({ type: "float" })
  netAmount: number;

  // Total of netAmount
  @Column({ type: "float" })
  amountPaid: number;

  @Column() salesType: SalesType;

  @Column() transactionStatus: TransactionStatus;

  @Column({ nullable: true })
  comments: string;

  @ManyToOne(type => Customer, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
    nullable: true
  })
  @JoinColumn({ name: "customerId" })
  customer: Customer;

  @Column({ nullable: true })
  customerId?: string;

  @Column() isActive: boolean;
}
