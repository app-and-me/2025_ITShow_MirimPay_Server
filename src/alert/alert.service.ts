import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { Alert } from './entities/alert.entity';
import { UserAlert } from './entities/user-alert.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    @InjectRepository(UserAlert)
    private userAlertRepository: Repository<UserAlert>,
  ) {}

  async create(createAlertDto: CreateAlertDto): Promise<Alert> {
    const alert = this.alertRepository.create(createAlertDto);
    return this.alertRepository.save(alert);
  }

  async findAll(userId: number): Promise<any[]> {
    const query = this.alertRepository
      .createQueryBuilder('alert')
      .leftJoin(
        'user_alerts',
        'ua',
        'ua.alertId = alert.id AND ua.userId = :userId',
        { userId },
      )
      .select([
        'alert.*',
        'COALESCE(ua.isRead, false) as isRead',
        'ua.readAt as readAt',
      ])
      .orderBy('alert.date', 'DESC');

    return query.getRawMany();
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

  async markAsRead(userId: number, alertId: number): Promise<void> {
    const existingUserAlert = await this.userAlertRepository.findOne({
      where: { userId, alertId },
    });

    if (existingUserAlert) {
      await this.userAlertRepository.update(existingUserAlert.id, {
        isRead: true,
        readAt: new Date(),
      });
    } else {
      const userAlert = this.userAlertRepository.create({
        userId,
        alertId,
        isRead: true,
        readAt: new Date(),
      });
      await this.userAlertRepository.save(userAlert);
    }
  }

  async getUnreadCount(userId: number): Promise<number> {
    const totalAlerts = await this.alertRepository.count();
    const readAlerts = await this.userAlertRepository.count({
      where: { userId, isRead: true },
    });
    return totalAlerts - readAlerts;
  }
}
