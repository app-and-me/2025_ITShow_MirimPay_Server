import { IsString, IsInt, Min, IsEnum, IsNotEmpty } from 'class-validator';
import { productCategory } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsNotEmpty()
  @IsEnum(productCategory)
  category: productCategory;
}
