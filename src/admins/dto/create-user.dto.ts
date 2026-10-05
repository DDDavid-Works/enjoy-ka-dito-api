import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string

  @IsEmail()
  @MaxLength(200)
  email!: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  contactNumber?: string

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string
}
