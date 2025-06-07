import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { AlertType } from '../entities/alert.entity';

export class CreateAlertDto {
  @IsEnum(AlertType)
  type: AlertType;

  @IsString()
  @IsNotEmpty()
  message: string;
}
