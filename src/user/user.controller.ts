import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterCardDto } from './dto/register-card.dto';
import {
  CreateQrPaymentDto,
  ProcessPaymentDto,
  FacePaymentDto,
} from './dto/payment.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post(':id/face')
  @ApiOperation({ summary: '사용자 얼굴 등록' })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('face'))
  async registerFace(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.registerFace(+id, file);
  }

  @Post('face/recognize')
  @ApiOperation({ summary: '얼굴 인식으로 사용자 찾기' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('face'))
  async recognizeFace(@UploadedFile() file: Express.Multer.File) {
    return this.userService.recognizeFace(file);
  }

  @Post('card')
  @ApiOperation({ summary: '사용자 카드 등록' })
  async registerCard(@Body() dto: RegisterCardDto) {
    return this.userService.registerCard(dto);
  }

  @Get(':id/cards')
  @ApiOperation({ summary: '사용자 카드 목록 조회' })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  async getUserCards(@Param('id') id: string) {
    return this.userService.getUserCards(+id);
  }

  @Post(':id/cards/:cardId/main')
  @ApiOperation({ summary: '메인 카드 변경' })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiParam({ name: 'cardId', description: '카드 ID' })
  async setMainCard(@Param('id') id: string, @Param('cardId') cardId: string) {
    return this.userService.setMainCard(+id, +cardId);
  }

  @Post('qr/payment')
  @ApiOperation({ summary: 'QR 결제 생성' })
  async createQrPayment(@Body() dto: CreateQrPaymentDto) {
    return this.userService.createQrPayment(dto);
  }

  @Post('process/payment')
  @ApiOperation({ summary: '결제 처리' })
  async processPayment(@Body() dto: ProcessPaymentDto) {
    return this.userService.processPayment(dto);
  }

  @Post('face/payment')
  @ApiOperation({ summary: '얼굴 인식 결제' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('face'))
  async faceRecognitionPayment(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: FacePaymentDto,
  ) {
    return this.userService.faceRecognitionPayment(file, dto);
  }

  @Get(':id/payment/history')
  @ApiOperation({ summary: '결제 내역 조회' })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  async getPaymentHistory(@Param('id') id: string) {
    return this.userService.getPaymentHistory(+id);
  }
}
