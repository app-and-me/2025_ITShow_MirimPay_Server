import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { NotFoundException } from '@nestjs/common';
import { PurchaseRequestDto } from './dto/purchase-request.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  create(dto: CreateProductDto) {
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  findAll() {
    return this.productRepo.find();
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('해당 제품을 찾을 수 없습니다.');
    }
    return product;
  }

  async processPurchase(dto: PurchaseRequestDto) {
    const updatedProducts: Product[] = [];
    for (const item of dto.items) {
      const product = await this.productRepo.findOne({
        where: { id: item.productId },
      });
      if (!product)
        throw new NotFoundException('해당 제품이 존재하지 않습니다.');
      if (product.quantity < item.quantity)
        throw new BadRequestException('제품의 재고가 부족합니다.');

      product.quantity -= item.quantity;
      updatedProducts.push(product);
    }

    await this.productRepo.save(updatedProducts);
    return {
      message: '구매가 완료되었습니다.',
      updated: updatedProducts.map((p) => ({ id: p.id, quantity: p.quantity })),
    };
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
    return { message: '삭제가 완료되었습니다.' };
  }
}
