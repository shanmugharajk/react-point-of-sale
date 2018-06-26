import { Entity, Column, PrimaryColumn, JoinColumn, OneToOne } from "typeorm";
import { Base } from "./Base";
import { IsNotEmpty, Length, IsEmail } from "class-validator";

@Entity()
export class Vendor extends Base {
  @IsNotEmpty()
  @PrimaryColumn()
  id: string;

  @IsNotEmpty()
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @IsNotEmpty()
  @Column()
  address: string;

  @IsNotEmpty()
  @Length(10, 10)
  @Column()
  mobile: string;

  @IsNotEmpty()
  @IsEmail()
  @Column()
  email: string;
}
