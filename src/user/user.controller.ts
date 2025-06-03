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

@ApiTags('users')
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

  @Post(':id/register-face')
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

  @Post('recognize-face')
  @ApiOperation({ summary: '얼굴 인식으로 사용자 찾기' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('face'))
  async recognizeFace(@UploadedFile() file: Express.Multer.File) {
    return this.userService.recognizeFace(file);
  }
}
