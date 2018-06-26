import { Base } from "./Base";
import { PrimaryColumn, OneToOne, Entity, JoinColumn, Column } from "typeorm";
import { Product } from "./Product";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Stock extends Base {
  @OneToOne(type => Product)
  @JoinColumn({ name: "id" })
  @PrimaryColumn()
  id: string;

  @Column({ type: "float" })
  qty: number;
}
