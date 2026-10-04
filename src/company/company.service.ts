import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CompanyDetails } from './company-details.entity.js'
import { UpdateCompanyDetailsDto } from './dto/update-company-details.dto.js'

// What the site showed before this was editable; used to seed the first read.
const DEFAULTS = {
  email: 'hello@enjoykadito.com',
  address: '',
  contactNumbers: ['+63 900 000 0000'],
}

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyDetails)
    private readonly details: Repository<CompanyDetails>,
  ) {}

  async get() {
    const existing = await this.details.find({ take: 1 })
    if (existing[0]) return existing[0]
    return this.details.save(this.details.create(DEFAULTS))
  }

  async update(dto: UpdateCompanyDetailsDto) {
    const current = await this.get()
    const contactNumbers = dto.contactNumbers?.map((n) => n.trim()).filter(Boolean)
    return this.details.save(
      this.details.merge(current, {
        ...dto,
        email: dto.email?.trim(),
        address: dto.address?.trim(),
        ...(contactNumbers ? { contactNumbers } : {}),
      }),
    )
  }
}
