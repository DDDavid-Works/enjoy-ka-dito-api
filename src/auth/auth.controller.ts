import { Body, Controller, Get, HttpCode, Patch, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { AdminsService } from '../admins/admins.service.js'
import { ChangePasswordDto } from '../admins/dto/change-password.dto.js'
import { LoginDto } from './dto/login.dto.js'
import { JwtAuthGuard } from './jwt-auth.guard.js'
import { CurrentAdmin, type CurrentAdminPayload } from './current-admin.decorator.js'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly admins: AdminsService,
  ) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password)
  }

  // Fresh copy of the signed-in user, so permission changes show up without logging in again.
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentAdmin() admin: CurrentAdminPayload) {
    return admin
  }

  // Anyone signed in can change their own password; no module needed.
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  @HttpCode(204)
  async changeOwnPassword(@Body() dto: ChangePasswordDto, @CurrentAdmin() admin: CurrentAdminPayload) {
    await this.admins.changePassword(admin.id, dto, admin.id)
  }
}
