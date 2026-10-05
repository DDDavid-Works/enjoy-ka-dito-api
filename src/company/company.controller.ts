import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { CompanyService } from './company.service.js'
import { UpdateCompanyDetailsDto } from './dto/update-company-details.dto.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { AppModule, RequireModules } from '../auth/modules.js'
import { ModulesGuard } from '../auth/modules.guard.js'

@Controller('company-details')
export class CompanyController {
  constructor(private readonly company: CompanyService) {}

  // Public: the website footer and Contact Us page show these.
  @Get()
  get() {
    return this.company.get()
  }

  @UseGuards(JwtAuthGuard, ModulesGuard)
  @RequireModules(AppModule.Company)
  @Patch()
  update(@Body() dto: UpdateCompanyDetailsDto) {
    return this.company.update(dto)
  }
}
