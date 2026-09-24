import { IsIn } from 'class-validator'
import type { InquiryStatus } from '../inquiry.entity.js'

export class UpdateInquiryDto {
  @IsIn(['new', 'contacted', 'closed'])
  status!: InquiryStatus
}
