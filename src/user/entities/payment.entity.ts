import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Card } from './card.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  QR = 'QR',
  FACE = 'FACE',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  orderId: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar', length: 255 })
  orderName: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tossPaymentKey: string;

  @Column({ type: 'text', nullable: true })
  tossResponse: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => Card, { onDelete: 'CASCADE' })
  card: Card;

  @Column({ nullable: true })
  cardId: number;

  @CreateDateColumn()
  createdAt: Date;
}
