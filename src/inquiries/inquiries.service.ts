import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Package } from '../packages/package.entity.js'
import { Inquiry } from './inquiry.entity.js'
import { CreateInquiryDto } from './dto/create-inquiry.dto.js'
import { UpdateInquiryDto } from './dto/update-inquiry.dto.js'

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiries: Repository<Inquiry>,
    @InjectRepository(Package)
    private readonly packages: Repository<Package>,
  ) {}

  findAll() {
    // Only id and title of each quotation, so the list stays light.
    return this.inquiries
      .createQueryBuilder('inquiry')
      .leftJoinAndSelect('inquiry.package', 'package')
      .leftJoin('inquiry.quotations', 'quotation')
      .addSelect(['quotation.id', 'quotation.title'])
      .orderBy('inquiry.createdAt', 'DESC')
      .getMany()
  }

  async findOne(id: string) {
    const inquiry = await this.inquiries.findOne({ where: { id }, relations: { package: true } })
    if (!inquiry) throw new NotFoundException('Inquiry not found')
    return inquiry
  }

  async create(dto: CreateInquiryDto) {
    // Ignore an unknown package id instead of failing the whole inquiry on the foreign key.
    const linkedPackage = dto.packageId ? await this.packages.findOne({ where: { id: dto.packageId } }) : null

    const inquiry = this.inquiries.create({
      type: dto.type ?? 'quote',
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
      package: linkedPackage ?? undefined,
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
