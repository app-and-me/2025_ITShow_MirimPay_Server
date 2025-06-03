import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  billingKey: string;

  @Column({ type: 'varchar', length: 255 })
  customerKey: string;

  @Column({ type: 'varchar', length: 100 })
  cardCompany: string;

  @Column({ type: 'varchar', length: 50 })
  cardNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cardNickname: string;

  @Column({ type: 'boolean', default: false })
  isMainCard: boolean;

  @ManyToOne(() => User, (user) => user.cards, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
