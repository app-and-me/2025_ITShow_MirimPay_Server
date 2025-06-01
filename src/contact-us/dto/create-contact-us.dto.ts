import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export enum ContactStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class CreateContactUsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  detail: string;

  @IsOptional()
  @IsString()
  response?: string;

  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @IsNotEmpty()
  userId: number;
}
