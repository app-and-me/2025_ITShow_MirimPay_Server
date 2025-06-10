import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

export enum contactUsCategory {
  STOCK = '재고',
  STORE = '입고',
  SOLD_OUT = '품절',
  OPERATION = '운영',
  OTHER = '그 외'
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

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'enum', enum: contactUsCategory })
  category: contactUsCategory;

  @ManyToOne(() => User, (user) => user.contactUs, { onDelete: 'CASCADE' })
  user: User;
}
