import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { LoginDto } from './dto/login.dto.js'
import { JwtAuthGuard } from './jwt-auth.guard.js'
import { CurrentAdmin, type CurrentAdminPayload } from './current-admin.decorator.js'

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

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
}
