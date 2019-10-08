import { UpdateDateColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Exclude } from "class-transformer";

export abstract class Base {
  @Exclude()
  @CreateDateColumn()
  createdAt?: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt?: Date;

  @Exclude()
  @ManyToOne(type => User, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
    nullable: false
  })
  createdBy: string;

  @Exclude()
  @ManyToOne(type => User, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
    nullable: false
  })
  updatedBy: string;
}
