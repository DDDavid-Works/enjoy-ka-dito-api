import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { AdminsService } from '../admins/admins.service.js'

@Injectable()
export class AuthService {
  constructor(
    private readonly admins: AdminsService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.admins.findByEmail(email)
    if (!admin) throw new UnauthorizedException('Incorrect email or password.')

    const matches = await bcrypt.compare(password, admin.passwordHash)
    if (!matches) throw new UnauthorizedException('Incorrect email or password.')

    if (!admin.active) {
      throw new UnauthorizedException('This account has been deactivated.')
    }

    const accessToken = await this.jwt.signAsync({ sub: admin.id, email: admin.email })

    return {
      accessToken,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    }
  }
}
