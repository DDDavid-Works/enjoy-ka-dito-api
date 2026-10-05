import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { AppModule } from './modules.js'

export type CurrentAdminPayload = { id: string; email: string; name: string; role: string; modules: AppModule[] }

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentAdminPayload | undefined => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)
