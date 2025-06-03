import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ContactUs } from 'src/contact-us/entities/contact-us.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nickname: string;

  @Column({ nullable: true })
  faceImagePath: string;

  @Column({ type: 'text', nullable: true })
  faceEncoding: string;

  @OneToMany(() => ContactUs, (contactUs) => contactUs.user)
  contactUs: ContactUs[];
}
