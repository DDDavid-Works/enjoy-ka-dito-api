import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { HotelsService } from './hotels.service.js'
import { CreateHotelDto } from './dto/create-hotel.dto.js'
import { UpdateHotelDto } from './dto/update-hotel.dto.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'

@UseGuards(JwtAuthGuard)
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotels: HotelsService) {}

  @Get()
  findAll() {
    return this.hotels.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotels.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateHotelDto) {
    return this.hotels.create(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHotelDto) {
    return this.hotels.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotels.remove(id)
  }
}
