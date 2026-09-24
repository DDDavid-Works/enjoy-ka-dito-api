import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/** Same as JwtAuthGuard, but never rejects the request — it just leaves req.user unset when no valid token is present. */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(_err: unknown, user: TUser) {
    return user
  }
}
