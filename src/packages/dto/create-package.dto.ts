import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator'
import type { ItineraryDay, PackageCategory, PackageStatus } from '../package.entity.js'

class ItineraryDayDto implements ItineraryDay {
  @IsString()
  @MaxLength(200)
  label!: string

  @IsString()
  @MaxLength(2000)
  description!: string
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
