import { IsEmail, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'

export class CreateInquiryDto {
  @IsString()
  @MaxLength(200)
  name!: string

  @IsEmail()
  email!: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  destination?: string

  @IsString()
  @MaxLength(3000)
  message!: string

  @IsOptional()
  @IsUUID()
  packageId?: string
}
