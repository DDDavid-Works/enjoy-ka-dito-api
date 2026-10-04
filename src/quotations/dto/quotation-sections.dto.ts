import { Type } from 'class-transformer'
import { IsArray, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator'
import type {
  QuotationAccommodation,
  QuotationDetail,
  QuotationInclusion,
  QuotationOptionalTour,
  QuotationSubDetail,
} from '../../packages/package.entity.js'

export class QuotationSubDetailDto implements QuotationSubDetail {
  @IsString()
  @MaxLength(500)
  text!: string

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number
}

export class QuotationDetailDto implements QuotationDetail {
  @IsString()
  @MaxLength(500)
  text!: string

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationSubDetailDto)
  details!: QuotationSubDetailDto[]
}

export class QuotationInclusionDto implements QuotationInclusion {
  @IsString()
  @MaxLength(500)
  text!: string

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationDetailDto)
  details!: QuotationDetailDto[]
}

export class QuotationAccommodationDto implements QuotationAccommodation {
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

export class QuotationOptionalTourDto implements QuotationOptionalTour {
  @IsString()
  @MaxLength(500)
  text!: string

  @IsArray()
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  details!: string[]
}
