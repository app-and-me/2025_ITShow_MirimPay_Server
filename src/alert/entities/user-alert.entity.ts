import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Alert } from './alert.entity';

@Entity('user_alerts')
@Unique(['userId', 'alertId'])
export class UserAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  alertId: number;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  readAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Alert)
  @JoinColumn({ name: 'alertId' })
  alert: Alert;
}
