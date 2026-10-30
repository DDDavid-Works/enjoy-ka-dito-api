import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Inquiry } from '../inquiries/inquiry.entity.js'
import { Package } from '../packages/package.entity.js'
import { Quotation } from './quotation.entity.js'
import { QuotationDefaults } from './quotation-defaults.entity.js'
import { QuotationsService } from './quotations.service.js'
import { QuotationsController } from './quotations.controller.js'
import { QuotationDefaultsService } from './quotation-defaults.service.js'
import { QuotationDefaultsController } from './quotation-defaults.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([Quotation, QuotationDefaults, Package, Inquiry])],
  providers: [QuotationsService, QuotationDefaultsService],
  controllers: [QuotationsController, QuotationDefaultsController],
})
export class QuotationsModule {}
