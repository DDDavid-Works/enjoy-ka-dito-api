import { IsEmail, IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'
import type { TravelerType } from '../inquiry.entity.js'

const TRAVELER_TYPES: TravelerType[] = ['Corporate Group', 'Family', 'Senior Group', 'Solo Foreigner']

export class CreateInquiryDto {
  @IsString()
  @MaxLength(200)
  name!: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  designation?: string

  @IsEmail()
  email!: string

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  budgetBracket?: string

  @IsOptional()
  @IsIn(TRAVELER_TYPES)
  travelerType?: TravelerType

  @IsOptional()
  @IsString()
  @MaxLength(200)
  destination?: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  travelerCount?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  travelDates?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  countryOfResidence?: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  groupType?: string

  @IsOptional()
  @IsString()
  @MaxLength(10)
  travelingWithSeniorsOrChildren?: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  flightsBooked?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  desiredDestinations?: string

  @IsOptional()
  @IsString()
  @MaxLength(30)
  tripDuration?: string

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  message?: string

  @IsOptional()
  @IsUUID()
  packageId?: string
}
