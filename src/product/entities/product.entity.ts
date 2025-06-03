import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column('int')
  price: number;

  @Column('int')
  quantity: number;
}
