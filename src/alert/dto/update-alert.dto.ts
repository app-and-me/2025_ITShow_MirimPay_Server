import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { CreateAlertDto } from './create-alert.dto';
import { AlertType } from '../entities/alert.entity';

export class UpdateAlertDto extends PartialType(CreateAlertDto) {
  @IsOptional()
  @IsEnum(AlertType)
  type?: AlertType;

  @IsOptional()
  @IsString()
  message?: string;
}
