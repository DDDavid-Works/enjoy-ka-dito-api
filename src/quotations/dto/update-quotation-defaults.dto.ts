import { IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateQuotationDefaultsDto {
  @IsOptional()
  @IsString()
  @MaxLength(20000)
  inclusionNotes?: string

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  paymentNotes?: string

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  importantNotes?: string
}
