import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ContactUs } from 'src/contact-us/entities/contact-us.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  nickname: string;

  @OneToMany(() => ContactUs, (contact) => contact.user)
  contacts: ContactUs[];
}
