import { IsNumber } from 'class-validator';

export class RegisterFaceDto {
  @IsNumber()
  userId: number;
}
