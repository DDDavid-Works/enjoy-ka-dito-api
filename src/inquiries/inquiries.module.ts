import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Inquiry } from './inquiry.entity.js'
import { InquiriesService } from './inquiries.service.js'
import { InquiriesController } from './inquiries.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry])],
  providers: [InquiriesService],
  controllers: [InquiriesController],
})
export class InquiriesModule {}
