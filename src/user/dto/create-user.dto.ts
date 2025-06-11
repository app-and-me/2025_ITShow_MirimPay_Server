import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  pin: string;
}
