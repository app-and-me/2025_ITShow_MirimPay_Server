import { IsString } from 'class-validator';

export class RegisterFaceBase64Dto {
  @IsString()
  faceImage: string;
}
