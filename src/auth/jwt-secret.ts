import type { ConfigService } from '@nestjs/config'

const DEV_SECRET = 'dev-secret-change-me'

// The secret that signs admin login tokens. In production it must be set explicitly:
// falling back to the built-in development value would let anyone forge an admin login.
export function getJwtSecret(config: ConfigService): string {
  const secret = config.get<string>('JWT_SECRET')
  if (secret) return secret

  if (config.get('NODE_ENV') === 'production') {
    throw new Error('JWT_SECRET must be set when NODE_ENV=production')
  }
  return DEV_SECRET
}
