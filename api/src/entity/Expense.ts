import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Base } from "./Base";
import { ExpenseType } from "./ExpenseType";
import { IsNotEmpty, IsPositive } from "class-validator";

@Entity()
export class Expense extends Base {
  @PrimaryGeneratedColumn() id: string;

  @IsNotEmpty()
  @Column()
  description: string;

  @IsPositive()
  @Column({ type: "float" })
  amount: number;

  @IsNotEmpty()
  @Column()
  spentAt: Date;

  @ManyToOne(type => ExpenseType, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "expenseTypeId" })
  expenseType: ExpenseType;

  @IsNotEmpty()
  @Column()
  expenseTypeId: string;
}
