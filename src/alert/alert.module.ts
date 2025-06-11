import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { Alert } from './entities/alert.entity';
import { UserAlert } from './entities/user-alert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alert, UserAlert])],
  controllers: [AlertController],
  providers: [AlertService],
})
export class AlertModule {}
