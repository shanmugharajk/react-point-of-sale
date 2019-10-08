import { Base } from "./Base";
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Index
} from "typeorm";
import { Customer } from "./Customer";
import { IsNotEmpty, IsNumber, Min, IsPositive, IsEnum } from "class-validator";
import { TransactionHeader } from "./TransactionHeader";

export enum CreditTransactionsType {
  Sale,
  Payment,
  SaleRevertPayment
}

@Entity()
export class CreditTransactions extends Base {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(type => Customer, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "customerId" })
  customer: Customer;

  @IsNotEmpty()
  @Column()
  @Index()
  customerId: string;

  @ManyToOne(() => TransactionHeader, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
    nullable: true
  })
  @JoinColumn({ name: "transactionId" })
  @Index()
  transactionId?: number;

  @IsNumber()
  @Min(0)
  @Column({ type: "float", nullable: true })
  billAmount?: number;

  @IsPositive()
  @Column({ type: "float" })
  amountPaid: number;

  @Column({ type: "float" })
  balance: number;

  @Column({ type: "float" })
  totalDebt: number;

  @IsEnum(CreditTransactionsType)
  @Column()
  type: CreditTransactionsType;

  @IsNotEmpty()
  @Column()
  paidDate: Date;

  @Column() isReverted: boolean;
}
