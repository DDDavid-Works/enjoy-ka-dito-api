import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { MODULES_KEY, type AppModule } from './modules.js'

/** Use after JwtAuthGuard, together with @RequireModules(). */
@Injectable()
export class ModulesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const required = this.reflector.getAllAndOverride<AppModule[] | undefined>(MODULES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!required?.length) return true

    const user = context.switchToHttp().getRequest().user as { modules?: AppModule[] } | undefined
    if (required.some((m) => user?.modules?.includes(m))) return true

    throw new ForbiddenException("You don't have access to this module.")
  }
}
