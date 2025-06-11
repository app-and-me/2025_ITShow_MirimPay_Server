import { IsString, IsOptional } from 'class-validator';

export class RegisterCardDto {
  @IsString()
  cardNumber: string;

  @IsString()
  expiryYear: string;

  @IsString()
  expiryMonth: string;

  @IsString()
  cardPassword: string;

  @IsString()
  cvc: string;

  @IsString()
  identityNumber: string;

  @IsOptional()
  @IsString()
  cardNickname?: string;

  @IsOptional()
  isMainCard?: boolean;
}
