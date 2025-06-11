import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UpdateContactUsDto } from './dto/update-contact-us.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  create(@Body() dto: CreateContactUsDto) {
    return this.contactUsService.create(dto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.contactUsService.findAll(status);
  }

  @Post(':id/response')
  async respondToContact(
    @Param('id') id: string,
    @Body() dto: UpdateContactUsDto,
  ) {
    return this.contactUsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactUsService.remove(+id);
  }
}
