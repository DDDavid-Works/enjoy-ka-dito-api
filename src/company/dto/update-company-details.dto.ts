import { ArrayMaxSize, IsArray, IsEmail, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator'

export class UpdateCompanyDetailsDto {
  // An empty string clears the email; anything else must be a valid address.
  @IsOptional()
  @ValidateIf((_, value) => value !== '')
  @IsEmail()
  @MaxLength(200)
  email?: string

  // The full list of public email addresses, in display order.
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsEmail({}, { each: true })
  @MaxLength(200, { each: true })
  emails?: string[]

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  contactNumbers?: string[]
}
