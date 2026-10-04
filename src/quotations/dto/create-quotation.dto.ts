import { Type } from 'class-transformer'
import { IsArray, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator'
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
