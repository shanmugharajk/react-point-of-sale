import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { ProductType } from "./ProductType";
import { IsNotEmpty, IsPositive } from "class-validator";

@Entity()
export class Product extends Base {
  @IsNotEmpty()
  @PrimaryColumn()
  id: string;

  @IsNotEmpty()
  @Column()
  name: string;

  @IsNotEmpty()
  @Column()
  description: string;

  @IsPositive()
  @Column({ type: "float" })
  costPrice: number;

  @IsPositive()
  @Column({ type: "float" })
  sellingPrice: number;

  @ManyToOne(type => ProductType, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
    cascade: ["insert"]
  })
  @JoinColumn({ name: "productTypeId" })
  productType: ProductType;

  @IsNotEmpty()
  @Column()
  productTypeId: string;
}
