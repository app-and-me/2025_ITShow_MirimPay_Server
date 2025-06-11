import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactUs, contactStatus } from './entities/contact-us.entity';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UpdateContactUsDto } from './dto/update-contact-us.dto';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUs)
    private contactRepo: Repository<ContactUs>,
  ) {}

  async getPendingStatus() {
    return this.contactRepo.find({
      where: { status: contactStatus.PENDING },
    });
  }

  async getCompletedStatus() {
    return this.contactRepo.find({
      where: { status: contactStatus.COMPLETED },
    });
  }

  create(dto: CreateContactUsDto) {
    const contact = this.contactRepo.create(dto);
    return this.contactRepo.save(contact);
  }

  findAll(status?: string) {
    if (status === 'pending') {
      return this.getPendingStatus();
    } else if (status === 'completed') {
      return this.getCompletedStatus();
    }

    return this.contactRepo.find();
  }

  async update(id: number, dto: UpdateContactUsDto) {
    const contact = await this.contactRepo.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`해당 문의를 찾을 수 없습니다.`);
    }
    if (contact.status === contactStatus.COMPLETED) {
      throw new NotFoundException(`이미 완료된 문의입니다.`);
    }

    contact.response = dto.response;
    contact.status = contactStatus.COMPLETED;
    return await this.contactRepo.save(contact);
  }

  async remove(id: number) {
    await this.contactRepo.delete(id);
    return { message: '삭제가 완료되었습니다.' };
  }
}
