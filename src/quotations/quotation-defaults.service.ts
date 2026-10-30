import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { QuotationDefaults } from './quotation-defaults.entity.js'
import { UpdateQuotationDefaultsDto } from './dto/update-quotation-defaults.dto.js'

@Injectable()
export class QuotationDefaultsService {
  constructor(
    @InjectRepository(QuotationDefaults)
    private readonly defaults: Repository<QuotationDefaults>,
  ) {}

  async get() {
    const existing = await this.defaults.find({ take: 1 })
    return existing[0] ?? this.defaults.save(this.defaults.create({}))
  }

  async update(dto: UpdateQuotationDefaultsDto) {
    return this.defaults.save(this.defaults.merge(await this.get(), dto))
  }
}
