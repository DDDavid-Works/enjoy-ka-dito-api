import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Package } from '../packages/package.entity.js'
import { Quotation } from './quotation.entity.js'
import { CreateQuotationDto } from './dto/create-quotation.dto.js'
import { UpdateQuotationDto } from './dto/update-quotation.dto.js'

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(Quotation)
    private readonly quotations: Repository<Quotation>,
    @InjectRepository(Package)
    private readonly packages: Repository<Package>,
  ) {}

  findAll() {
    return this.quotations.find({ relations: { package: true }, order: { updatedAt: 'DESC' } })
  }

  async findOne(id: string) {
    const quotation = await this.quotations.findOne({ where: { id }, relations: { package: true } })
    if (!quotation) throw new NotFoundException('Quotation not found')
    return quotation
  }

  async create(dto: CreateQuotationDto) {
    const { packageId, ...rest } = dto
    const saved = await this.quotations.save(
      this.quotations.create({ ...rest, package: await this.resolvePackage(packageId) }),
    )
    return this.findOne(saved.id)
  }

  async update(id: string, dto: UpdateQuotationDto) {
    const quotation = await this.findOne(id)
    // The source package is set once at creation; editing never re-links it.
    const { packageId: _packageId, ...rest } = dto
    await this.quotations.save(this.quotations.merge(quotation, rest))
    return this.findOne(id)
  }

  async remove(id: string) {
    const result = await this.quotations.delete(id)
    if (!result.affected) throw new NotFoundException('Quotation not found')
  }

  private async resolvePackage(packageId?: string) {
    if (!packageId) return undefined
    return (await this.packages.findOne({ where: { id: packageId } })) ?? undefined
  }
}
