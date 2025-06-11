import { IsNumber, IsString } from 'class-validator';

export class CreateQrPaymentDto {
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

export class FacePaymentBase64Dto {
  @IsString()
  faceImage: string;

  @IsNumber()
  amount: number;

  @IsString()
  orderName: string;
}
