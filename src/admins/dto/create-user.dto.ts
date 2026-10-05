import { IsArray, IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { AppModule } from '../../auth/modules.js'

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

  @IsArray()
  @IsEnum(AppModule, { each: true })
  modules!: AppModule[]

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string
}
