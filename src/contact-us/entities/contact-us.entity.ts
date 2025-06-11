import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export enum contactUsCategory {
  STOCK = '재고',
  STORE = '입고',
  SOLD_OUT = '품절',
  OPERATION = '운영',
  OTHER = '그 외'
}

export enum contactStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

@Entity()
export class ContactUs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  detail: string;

  @Column({ nullable: true })
  response: string;

  @Column({ type: 'enum', enum: contactStatus, default: 'PENDING' })
  status: contactStatus;

  @Column({ type: 'enum', enum: contactUsCategory })
  category: contactUsCategory;
}
