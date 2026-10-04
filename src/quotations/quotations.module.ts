import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Inquiry } from '../inquiries/inquiry.entity.js'
import { Package } from '../packages/package.entity.js'
import { Quotation } from './quotation.entity.js'
import { QuotationsService } from './quotations.service.js'
import { QuotationsController } from './quotations.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([Quotation, Package, Inquiry])],
  providers: [QuotationsService],
  controllers: [QuotationsController],
})
export class QuotationsModule {}
