import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CompanyDetails } from './company-details.entity.js'
import { UpdateCompanyDetailsDto } from './dto/update-company-details.dto.js'
import { RevalidationService } from '../revalidation/revalidation.service.js'

// What the site showed before this was editable; used to seed the first read.
const DEFAULTS = {
  email: 'hello@enjoykadito.com',
  emails: ['hello@enjoykadito.com'],
  address: '',
  contactNumbers: ['+63 900 000 0000'],
}

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyDetails)
    private readonly details: Repository<CompanyDetails>,
    private readonly revalidation: RevalidationService,
  ) {}

  async get() {
    const existing = await this.details.find({ take: 1 })
    if (existing[0]) {
      // Rows saved before several emails were supported only have `email`.
      if (existing[0].emails.length === 0 && existing[0].email) {
        existing[0].emails = [existing[0].email]
        return this.details.save(existing[0])
      }
      return existing[0]
    }
    return this.details.save(this.details.create(DEFAULTS))
  }

  async update(dto: UpdateCompanyDetailsDto) {
    const current = await this.get()
    const contactNumbers = dto.contactNumbers?.map((n) => n.trim()).filter(Boolean)
    // `emails` is the source of truth; a lone `email` from an older client replaces the list.
    const emails = (dto.emails ?? (dto.email !== undefined ? [dto.email] : undefined))
      ?.map((e) => e.trim())
      .filter(Boolean)
    const saved = await this.details.save(
      this.details.merge(current, {
        ...dto,
        ...(emails ? { emails, email: emails[0] ?? '' } : {}),
        address: dto.address?.trim(),
        ...(contactNumbers ? { contactNumbers } : {}),
      }),
    )
    void this.revalidation.revalidate(['company'])
    return saved
  }
}
