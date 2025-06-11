import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterCardDto } from './dto/register-card.dto';
import {
  CreateQrPaymentDto,
  ProcessPaymentDto,
  FacePaymentDto,
  FacePaymentBase64Dto,
} from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RecognizeFaceBase64Dto } from './dto/recognize-face-base64.dto';
import { RegisterFaceBase64Dto } from './dto/register-face.dto';
import { User } from './entities/user.entity';

export interface ExtendedUser extends User {
  scopes?: string[];
  clientId?: string;
}

export interface RequestWithUser extends Request {
  user?: ExtendedUser;
}

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '현재 사용자 정보 조회' })
  @ApiBearerAuth()
  findMe(@Req() req: RequestWithUser) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    return this.userService.findOne(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Post('face')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '사용자 얼굴 등록' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('face'))
  async registerFace(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    return this.userService.registerFace(userId, file);
  }

  @Post('face/base64')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '사용자 얼굴 등록 (Base64)' })
  @ApiBearerAuth()
  async registerFaceBase64(
    @Req() req: RequestWithUser,
    @Body() dto: RegisterFaceBase64Dto,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    return this.userService.registerFaceBase64(userId, dto.faceImage);
  }

  @Post('face/recognize')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '얼굴 인식으로 사용자 찾기' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('face'))
  async recognizeFace(@UploadedFile() file: Express.Multer.File) {
    return this.userService.recognizeFace(file);
  }

  @Post('face/recognize/base64')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '얼굴 인식으로 사용자 찾기 (Base64)' })
  async recognizeFaceBase64(@Body() dto: RecognizeFaceBase64Dto) {
    return this.userService.recognizeFaceBase64(dto.faceImage);
  }

  @Post('card')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '사용자 카드 등록' })
  @ApiBearerAuth()
  async registerCard(
    @Req() req: RequestWithUser,
    @Body() dto: RegisterCardDto,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    return this.userService.registerCard(dto, userId);
  }

  @Get('cards')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '사용자 카드 목록 조회' })
  @ApiBearerAuth()
  async getUserCards(@Req() req: RequestWithUser) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    return this.userService.getUserCards(userId);
  }

  @Post('cards/:cardId/main')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '메인 카드 변경' })
  @ApiBearerAuth()
  @ApiParam({ name: 'cardId', description: '카드 ID' })
  async setMainCard(
    @Req() req: RequestWithUser,
    @Param('cardId') cardId: string,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    return this.userService.setMainCard(userId, +cardId);
  }

  @Delete('cards/:cardId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '카드 삭제' })
  @ApiBearerAuth()
  @ApiParam({ name: 'cardId', description: '카드 ID' })
  async deleteCard(
    @Req() req: RequestWithUser,
    @Param('cardId') cardId: string,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    return this.userService.deleteCard(userId, +cardId);
  }

  @Post('payment/qr')
  @ApiOperation({ summary: 'QR 결제 생성' })
  @ApiBearerAuth()
  async createQrPayment(@Body() dto: CreateQrPaymentDto) {
    return this.userService.createQrPayment(dto);
  }

  @Post('payment/process')
  @ApiOperation({ summary: '결제 처리' })
  async processPayment(@Body() dto: ProcessPaymentDto) {
    return this.userService.processPayment(dto);
  }

  @Post('payment/face')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '얼굴 인식 결제' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('face'))
  async faceRecognitionPayment(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: FacePaymentDto,
  ) {
    return this.userService.faceRecognitionPayment(file, dto);
  }

  @Post('payment/face/base64')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '얼굴 인식 결제 (Base64)' })
  async faceRecognitionPaymentBase64(@Body() dto: FacePaymentBase64Dto) {
    return this.userService.faceRecognitionPaymentBase64(dto.faceImage, dto);
  }

  @Get('payment/history')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '결제 내역 조회' })
  @ApiBearerAuth()
  async getPaymentHistory(@Req() req: RequestWithUser) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    return this.userService.getPaymentHistory(userId);
  }

  @Get('exist/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
