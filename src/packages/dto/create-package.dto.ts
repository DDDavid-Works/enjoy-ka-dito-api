import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'
import type { ItineraryDay, PackageCategory, PackageStatus, QuotationAccommodation, QuotationDetail, QuotationInclusion, QuotationOptionalTour } from '../package.entity.js'

class ItineraryDayDto implements ItineraryDay {
  @IsString()
  @MaxLength(200)
  label!: string

  @IsString()
  @MaxLength(2000)
  description!: string
}

class QuotationDetailDto implements QuotationDetail {
  @IsString()
  @MaxLength(500)
  text!: string

  @IsArray()
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  details!: string[]
}

class QuotationInclusionDto implements QuotationInclusion {
  @IsString()
  @MaxLength(500)
  text!: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationDetailDto)
  details!: QuotationDetailDto[]
}

class QuotationAccommodationDto implements QuotationAccommodation {
  @IsString()
  @MaxLength(100)
  hotelId!: string

  @IsInt()
  @Min(1)
  @Max(365)
  nights!: number

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  ratePerHead?: number
}

class QuotationOptionalTourDto implements QuotationOptionalTour {
  @IsString()
  @MaxLength(500)
  text!: string

  @IsArray()
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  details!: string[]
}

export class CreatePackageDto {
  @IsString()
  @MaxLength(200)
  title!: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  slug?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  duration?: string

  @IsIn(['Local Tours', 'International', 'Corporate / Group'])
  category!: PackageCategory

  @IsOptional()
  @IsString()
  @MaxLength(100)
  price?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  pax?: string

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  summary?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItineraryDayDto)
  itinerary?: ItineraryDayDto[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inclusions?: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  exclusions?: string[]

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  termsAndConditions?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationInclusionDto)
  quotationInclusions?: QuotationInclusionDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationAccommodationDto)
  quotationAccommodations?: QuotationAccommodationDto[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  quotationExclusions?: string[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationOptionalTourDto)
  quotationOptionalTours?: QuotationOptionalTourDto[]

  @IsOptional()
  @IsString()
  mainImage?: string

  @IsOptional()
  @IsString()
  poster?: string

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  gallery?: string[]

  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: PackageStatus
}
