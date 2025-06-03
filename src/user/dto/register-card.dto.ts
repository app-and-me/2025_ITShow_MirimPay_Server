import { IsString, IsNumber, IsOptional } from 'class-validator';

export class RegisterCardDto {
  @IsNumber()
  userId: number;

  @IsString()
  cardNumber: string;

  @IsString()
  expiryYear: string;

  @IsString()
  expiryMonth: string;

  @IsString()
  cardPassword: string;

  @IsString()
  identityNumber: string;

  @IsOptional()
  @IsString()
  cardNickname?: string;

  @IsOptional()
  isMainCard?: boolean;
}
