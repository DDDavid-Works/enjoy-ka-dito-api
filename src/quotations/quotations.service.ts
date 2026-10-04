import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Inquiry } from '../inquiries/inquiry.entity.js'
import { Package } from '../packages/package.entity.js'
import { Quotation } from './quotation.entity.js'
import { CreateQuotationDto } from './dto/create-quotation.dto.js'
import { UpdateQuotationDto } from './dto/update-quotation.dto.js'
import { toProperCase } from './proper-case.js'

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(Quotation)
    private readonly quotations: Repository<Quotation>,
    @InjectRepository(Package)
    private readonly packages: Repository<Package>,
    @InjectRepository(Inquiry)
    private readonly inquiries: Repository<Inquiry>,
  ) {}

  findAll() {
    return this.quotations.find({ relations: { package: true, inquiry: true }, order: { updatedAt: 'DESC' } })
  }

  async findOne(id: string) {
    const quotation = await this.quotations.findOne({ where: { id }, relations: { package: true, inquiry: true } })
    if (!quotation) throw new NotFoundException('Quotation not found')
    return quotation
  }

  async create(dto: CreateQuotationDto) {
    const { packageId, inquiryId, ...rest } = dto
    const saved = await this.quotations.save(
      this.quotations.create({
        ...rest,
        ...this.properName(rest.customerName),
        package: await this.resolvePackage(packageId),
        inquiry: await this.resolveInquiry(inquiryId),
      }),
    )
    return this.findOne(saved.id)
  }

  async update(id: string, dto: UpdateQuotationDto) {
    const quotation = await this.findOne(id)
    // The source package and inquiry are set once at creation; editing never re-links them.
    const { packageId: _packageId, inquiryId: _inquiryId, ...rest } = dto
    await this.quotations.save(this.quotations.merge(quotation, { ...rest, ...this.properName(rest.customerName) }))
    return this.findOne(id)
  }

  async remove(id: string) {
    const result = await this.quotations.delete(id)
    if (!result.affected) throw new NotFoundException('Quotation not found')
  }

  // Prepared For is always stored in proper case.
  private properName(customerName?: string) {
    return customerName === undefined ? {} : { customerName: toProperCase(customerName) }
  }

  private async resolveInquiry(inquiryId?: string) {
    if (!inquiryId) return undefined
    return (await this.inquiries.findOne({ where: { id: inquiryId } })) ?? undefined
  }

  private async resolvePackage(packageId?: string) {
    if (!packageId) return undefined
    return (await this.packages.findOne({ where: { id: packageId } })) ?? undefined
  }
}
