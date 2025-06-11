import { PartialType } from '@nestjs/mapped-types';
import { CreateContactUsDto } from './create-contact-us.dto';
import { contactStatus } from '../entities/contact-us.entity';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateContactUsDto extends PartialType(CreateContactUsDto) {
    @IsOptional()
    @IsString()
    response?: string;

    @IsOptional()
    @IsEnum(contactStatus)
    status?: contactStatus;
}
