import { IsString } from 'class-validator';

export class RecognizeFaceBase64Dto {
  @IsString()
  faceImage: string;
}
