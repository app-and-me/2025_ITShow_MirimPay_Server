import { IsString, IsInt, Min } from "class-validator";

export class PurchaseItemDto {
    @IsString()
    productId: string;

    @IsInt()
    @Min(1)
    quantity: number;
}
