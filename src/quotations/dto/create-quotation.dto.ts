import { Type } from 'class-transformer'
import { IsArray, IsISO8601, IsOptional, IsString, IsUUID, Matches, MaxLength, ValidateNested } from 'class-validator'
import {
  QuotationAccommodationDto,
  QuotationInclusionDto,
  QuotationOptionalTourDto,
} from './quotation-sections.dto.js'

export class CreateQuotationDto {
  @IsString()
  @MaxLength(200)
  title!: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  customerName?: string

  // null clears the date.
  @IsOptional()
  @IsISO8601({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'quoteDate must be a date in YYYY-MM-DD format' })
  quoteDate?: string | null

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  remarks?: string

  @IsOptional()
  @IsUUID()
  packageId?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationInclusionDto)
  inclusions?: QuotationInclusionDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationAccommodationDto)
  accommodations?: QuotationAccommodationDto[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  exclusions?: string[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationOptionalTourDto)
  optionalTours?: QuotationOptionalTourDto[]
}
