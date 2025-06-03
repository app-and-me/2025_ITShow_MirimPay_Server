import { IsNumber, IsString } from 'class-validator';

export class CreateQrPaymentDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  cardId: number;

  @IsNumber()
  amount: number;

  @IsString()
  orderName: string;
}

export class ProcessPaymentDto {
  @IsString()
  orderId: string;

  @IsNumber()
  amount: number;

  @IsString()
  billingKey: string;

  @IsString()
  customerKey: string;

  @IsString()
  orderName: string;
}

export class FacePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  orderName: string;
}
