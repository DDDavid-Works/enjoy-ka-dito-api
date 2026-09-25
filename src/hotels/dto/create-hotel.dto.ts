import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator'

export class CreateHotelDto {
  @IsString()
  @MaxLength(200)
  name!: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  contactPerson?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  contactNumbers?: string

  @IsString()
  @MaxLength(100)
  region!: string

  @IsInt()
  @Min(0)
  @Max(5)
  starRating!: number
}
