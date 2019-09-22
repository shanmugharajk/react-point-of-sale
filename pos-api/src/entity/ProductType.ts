import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Base } from './Base';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class ProductType extends Base {
  @IsNotEmpty()
  @PrimaryColumn()
  id: string;

  @IsNotEmpty()
  @Column()
  description: string;
}
