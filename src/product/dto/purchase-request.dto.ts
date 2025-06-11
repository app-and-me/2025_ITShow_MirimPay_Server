import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PurchaseItemDto } from './purchase-item.dto';

export class PurchaseRequestDto {
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items: PurchaseItemDto[];
}