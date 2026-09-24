import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { InquiriesService } from './inquiries.service.js'
import { CreateInquiryDto } from './dto/create-inquiry.dto.js'
import { UpdateInquiryDto } from './dto/update-inquiry.dto.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  @Post()
  create(@Body() dto: CreateInquiryDto) {
    return this.inquiries.create(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.inquiries.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateInquiryDto) {
    return this.inquiries.updateStatus(id, dto)
  }
}
