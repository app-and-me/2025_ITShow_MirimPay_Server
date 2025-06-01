import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { IsNotEmpty, IsEnum } from 'class-validator';

@Entity()
export class ContactUs {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.contacts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column('text')
  @IsNotEmpty()
  detail: string;

  @Column('text', { nullable: true })
  response: string;

  @Column({ default: '대기중' })
  @IsEnum(['대기중', '답변 완료', '종료'])
  status: string;
}
