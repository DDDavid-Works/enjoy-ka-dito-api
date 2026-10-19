import { BadRequestException, Injectable, Logger } from '@nestjs/common'

// Verifies a reCAPTCHA v3 token. Spam protection is off when RECAPTCHA_SECRET is unset (local development).
@Injectable()
export class RecaptchaService {
  private readonly logger = new Logger(RecaptchaService.name)

  async verify(token?: string) {
    const secret = process.env.RECAPTCHA_SECRET
    if (!secret) return

    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? 0.5)
    const rejected = new BadRequestException('Spam check failed. Please reload the page and try again.')
    if (!token) throw rejected

    let result: { success?: boolean; score?: number; 'error-codes'?: string[] }
    try {
      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: token }),
      })
      result = await response.json()
    } catch (err) {
      // Google unreachable: let real visitors through rather than losing inquiries.
      this.logger.error(`reCAPTCHA verification request failed: ${err}`)
      return
    }

    if (!result.success || (result.score ?? 0) < minScore) {
      this.logger.warn(`Inquiry rejected by reCAPTCHA (score ${result.score}, ${result['error-codes']?.join(',') ?? 'ok'})`)
      throw rejected
    }
  }
}
