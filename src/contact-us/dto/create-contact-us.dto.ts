import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { contactUsCategory } from '../entities/contact-us.entity';

export class CreateContactUsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsEnum(contactUsCategory)
  @IsNotEmpty()
  category: contactUsCategory;
}
