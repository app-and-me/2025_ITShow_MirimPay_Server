import { Entity, Column, PrimaryColumn } from 'typeorm';

export enum productCategory {
  SNACK = '과자',
  JELLY = '젤리',
  JUICE = '음료수',
  BREAD = '빵',
  MILK = '우유',
  ICED_FOOD = '냉동식품',
  ICECREAM = '아이스크림',
  ETC = '그 외',
}

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

  @Column({ type: 'enum', enum: productCategory })
  category: productCategory;
}
