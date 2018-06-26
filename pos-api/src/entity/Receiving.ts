import { Base } from "./Base";
import {
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
  Entity
} from "typeorm";
import { Product } from "./Product";
import { Vendor } from "./Vendor";
import { IsNotEmpty, IsPositive } from "class-validator";

@Entity()
export class Receiving extends Base {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(type => Product)
  @JoinColumn({ name: "productId" })
  product: Product;

  @IsNotEmpty()
  @Column()
  productId: string;

  @ManyToOne(type => Vendor)
  @JoinColumn({ name: "vendorId" })
  vendor: Vendor;

  @IsNotEmpty() vendorId: string;

  @IsPositive()
  @Column()
  qty: number;

  @IsPositive()
  @Column({ type: "float" })
  price: number;

  @IsNotEmpty()
  @Column()
  payedAt: Date;
}
