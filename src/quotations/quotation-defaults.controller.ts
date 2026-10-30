import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { QuotationDefaultsService } from './quotation-defaults.service.js'
import { UpdateQuotationDefaultsDto } from './dto/update-quotation-defaults.dto.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { AppModule, RequireModules } from '../auth/modules.js'
import { ModulesGuard } from '../auth/modules.guard.js'

@UseGuards(JwtAuthGuard, ModulesGuard)
@RequireModules(AppModule.Quotations)
@Controller('quotation-defaults')
export class QuotationDefaultsController {
  constructor(private readonly defaults: QuotationDefaultsService) {}

  @Get()
  get() {
    return this.defaults.get()
  }

  @Patch()
  update(@Body() dto: UpdateQuotationDefaultsDto) {
    return this.defaults.update(dto)
  }
}
