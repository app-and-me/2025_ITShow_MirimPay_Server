import { PartialType } from '@nestjs/mapped-types';
import { CreateContactUsDto } from './create-contact-us.dto';
import { IsString } from 'class-validator';

export class UpdateContactUsDto extends PartialType(CreateContactUsDto) {
  @IsString()
  response: string;
}
