import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Package } from '../packages/package.entity.js'
import { Inquiry } from './inquiry.entity.js'
import { InquiriesService } from './inquiries.service.js'
import { InquiriesController } from './inquiries.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry, Package])],
  providers: [InquiriesService],
  controllers: [InquiriesController],
})
export class InquiriesModule {}
