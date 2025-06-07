import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum AlertType {
  IN_STOCK = 0,
  SOLD_OUT = 1,
}

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: AlertType })
  type: AlertType;

  @Column()
  message: string;

  @CreateDateColumn()
  date: Date;
}
