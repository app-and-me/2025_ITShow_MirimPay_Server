import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactUs } from './entities/contact-us.entity';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UpdateContactUsDto } from './dto/update-contact-us.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUs)
    private contactRepo: Repository<ContactUs>,
  ) {}

  create(dto: CreateContactUsDto) {
    const contact = this.contactRepo.create({
      ...dto,
    });
    return this.contactRepo.save(contact);
  }

  findAll() {
    return this.contactRepo.find();
  }

  async findOne(id: number) {
    const contact = await this.contactRepo.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`해당 문의를 찾을 수 없습니다.`);
    }
    return contact;
  }

  async update(id: number, dto: UpdateContactUsDto) {
    const contact = await this.contactRepo.findOne({ where: { id } });
    if (!contact) throw new NotFoundException('문의를 찾을 수 없습니다.');
    Object.assign(contact, dto);
    return this.contactRepo.save(contact);
  }

  async remove(id: number) {
    await this.contactRepo.delete(id);
    return { message: '삭제가 완료되었습니다.' };
  }
}
