import { Base } from "./Base";
import { PrimaryColumn, ManyToOne, JoinColumn, Column, Entity } from "typeorm";
import { Product } from "./Product";
import { TransactionHeader } from "./TransactionHeader";
import { IsNotEmpty, IsPositive, Min, IsNumber } from "class-validator";

@Entity()
export class TransactionDetails extends Base {
  @PrimaryColumn() id: number;

  @ManyToOne(
    type => TransactionHeader,
    datasource => datasource.transactionDetails,
    { onUpdate: "CASCADE", onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "id" })
  transactionHeader: TransactionHeader;

  @ManyToOne(type => Product)
  @JoinColumn({ name: "productId" })
  product: Product;

  @IsNotEmpty()
  @Column()
  @PrimaryColumn()
  productId: string;

  @IsPositive()
  @Column()
  qty: number;

  @Column({ type: "float" })
  costPrice: number;

  @Column({ type: "float" })
  sellingPrice: number;

  @IsNumber()
  @Min(0)
  @Column({ type: "float" })
  discount: number;

  @IsNumber()
  @Min(0)
  @Column({ type: "float" })
  price: number;
}
