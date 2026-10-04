import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { QuotationsService } from './quotations.service.js'
import { CreateQuotationDto } from './dto/create-quotation.dto.js'
import { UpdateQuotationDto } from './dto/update-quotation.dto.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'

@UseGuards(JwtAuthGuard)
@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotations: QuotationsService) {}

  @Get()
  findAll() {
    return this.quotations.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotations.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateQuotationDto) {
    return this.quotations.create(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateQuotationDto) {
    return this.quotations.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotations.remove(id)
  }
}
