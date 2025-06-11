import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Card } from './card.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  nickname: string;

  @Column({ nullable: true })
  faceImagePath: string;

  @Column({ type: 'text', nullable: true })
  faceEncoding: string;

  @OneToMany(() => Card, (card) => card.user)
  cards: Card[];
}
