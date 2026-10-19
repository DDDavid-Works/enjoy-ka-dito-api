import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Package } from '../packages/package.entity.js'
import { Inquiry } from './inquiry.entity.js'
import { InquiriesService } from './inquiries.service.js'
import { InquiriesController } from './inquiries.controller.js'
import { RecaptchaService } from './recaptcha.service.js'
import { InquiryMailerService } from './inquiry-mailer.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry, Package])],
  providers: [InquiriesService, RecaptchaService, InquiryMailerService],
  controllers: [InquiriesController],
})
export class InquiriesModule {}
