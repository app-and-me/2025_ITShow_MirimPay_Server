import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { contactStatus, contactUsCategory } from '../entities/contact-us.entity';

export class CreateContactUsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsEnum(contactUsCategory)
  @IsNotEmpty()
  category: contactUsCategory;
}
