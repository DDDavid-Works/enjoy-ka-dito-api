import { createParamDecorator, type ExecutionContext } from '@nestjs/common'

export type CurrentAdminPayload = { id: string; email: string; name: string; role: string }

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentAdminPayload | undefined => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)
