import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { Alert } from './entities/alert.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
  ) {}

  async create(createAlertDto: CreateAlertDto): Promise<Alert> {
    const alert = this.alertRepository.create(createAlertDto);
    return this.alertRepository.save(alert);
  }

  async findAll(): Promise<Alert[]> {
    return this.alertRepository.find({
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Alert | null> {
    return this.alertRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateAlertDto: UpdateAlertDto,
  ): Promise<Alert | null> {
    await this.alertRepository.update(id, updateAlertDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.alertRepository.delete(id);
  }
}
