import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Hotel } from './hotel.entity.js'
import { CreateHotelDto } from './dto/create-hotel.dto.js'
import { UpdateHotelDto } from './dto/update-hotel.dto.js'

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotels: Repository<Hotel>,
  ) {}

  findAll() {
    return this.hotels.find({ order: { region: 'ASC', name: 'ASC' } })
  }

  async findOne(id: string) {
    const hotel = await this.hotels.findOne({ where: { id } })
    if (!hotel) throw new NotFoundException('Hotel not found')
    return hotel
  }

  create(dto: CreateHotelDto) {
    return this.hotels.save(this.hotels.create(dto))
  }

  async update(id: string, dto: UpdateHotelDto) {
    const hotel = await this.hotels.findOne({ where: { id } })
    if (!hotel) throw new NotFoundException('Hotel not found')
    return this.hotels.save(this.hotels.merge(hotel, dto))
  }

  async remove(id: string) {
    const result = await this.hotels.delete(id)
    if (!result.affected) throw new NotFoundException('Hotel not found')
  }
}
