import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { contactStatus, contactUsCategory } from '../entities/contact-us.entity';

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
  @IsEnum(contactStatus)
  status?: contactStatus;

  @IsNotEmpty()
  userId: number;

  @IsEnum(contactUsCategory)
  @IsNotEmpty()
  category: contactUsCategory;
}
