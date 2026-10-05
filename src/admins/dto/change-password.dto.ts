import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class ChangePasswordDto {
  // Required when changing your own password; admins resetting someone else's don't need it.
  @IsOptional()
  @IsString()
  currentPassword?: string

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword!: string
}
