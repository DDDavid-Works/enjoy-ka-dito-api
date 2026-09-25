import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Inquiry } from './inquiry.entity.js'
import { CreateInquiryDto } from './dto/create-inquiry.dto.js'
import { UpdateInquiryDto } from './dto/update-inquiry.dto.js'

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiries: Repository<Inquiry>,
  ) {}

  findAll() {
    return this.inquiries.find({
      relations: { package: true },
      order: { createdAt: 'DESC' },
    })
  }

  create(dto: CreateInquiryDto) {
    const inquiry = this.inquiries.create({
      name: dto.name,
      companyName: dto.companyName,
      designation: dto.designation,
      email: dto.email,
      phone: dto.phone,
      budgetBracket: dto.budgetBracket,
      travelerType: dto.travelerType,
      destination: dto.destination,
      travelerCount: dto.travelerCount,
      travelDates: dto.travelDates,
      countryOfResidence: dto.countryOfResidence,
      groupType: dto.groupType,
      travelingWithSeniorsOrChildren: dto.travelingWithSeniorsOrChildren,
      flightsBooked: dto.flightsBooked,
      desiredDestinations: dto.desiredDestinations,
      tripDuration: dto.tripDuration,
      message: dto.message,
      package: dto.packageId ? { id: dto.packageId } : undefined,
    })

    return this.inquiries.save(inquiry)
  }

  async updateStatus(id: string, dto: UpdateInquiryDto) {
    const inquiry = await this.inquiries.findOne({ where: { id } })
    if (!inquiry) throw new NotFoundException('Inquiry not found')

    inquiry.status = dto.status
    return this.inquiries.save(inquiry)
  }
}
