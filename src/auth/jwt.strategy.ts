import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AdminsService } from '../admins/admins.service.js'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly admins: AdminsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET', 'dev-secret-change-me'),
    })
  }

  async validate(payload: { sub: string }) {
    const admin = await this.admins.findById(payload.sub)
    if (!admin || !admin.active) throw new UnauthorizedException()

    return { id: admin.id, email: admin.email, name: admin.name, role: admin.role }
  }
}
