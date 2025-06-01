import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

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

  @ManyToOne(() => User, (user) => user.contactUs, { onDelete: 'CASCADE' })
  user: User;
}
