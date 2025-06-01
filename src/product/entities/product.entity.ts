import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsInt, Min } from 'class-validator';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column('int')
  @IsInt()
  @Min(0)
  price: number;

  @Column('int')
  @IsInt()
  @Min(0)
  quantity: number;
}
