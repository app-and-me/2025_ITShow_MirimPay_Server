import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUser } from 'src/user/user.controller';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createAlertDto: CreateAlertDto) {
    return this.alertService.create(createAlertDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: RequestWithUser) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    return this.alertService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.alertService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number, @Body() updateAlertDto: UpdateAlertDto) {
    return this.alertService.update(id, updateAlertDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number) {
    return this.alertService.remove(id);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  markAsRead(@Param('id') id: number, @Req() req: RequestWithUser) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    return this.alertService.markAsRead(userId, id);
  }

  @Get('unread/count')
  @UseGuards(JwtAuthGuard)
  getUnreadCount(@Req() req: RequestWithUser) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    return this.alertService.getUnreadCount(userId);
  }
}
