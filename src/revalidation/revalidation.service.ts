import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

// Tells the Next.js site (web/) to drop its cached copy of changed content, so edits show up right away.
// Does nothing unless WEB_URL and REVALIDATE_SECRET are set, and never fails the admin's save.
@Injectable()
export class RevalidationService {
  private readonly logger = new Logger(RevalidationService.name)

  constructor(private readonly config: ConfigService) {}

  async revalidate(tags: string[]) {
    const webUrl = this.config.get<string>('WEB_URL')
    const secret = this.config.get<string>('REVALIDATE_SECRET')
    if (!webUrl || !secret) return

    const unique = [...new Set(tags.filter(Boolean))]

    try {
      const response = await fetch(`${webUrl.replace(/\/$/, '')}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': secret },
        body: JSON.stringify({ tags: unique }),
        signal: AbortSignal.timeout(5000),
      })
      if (!response.ok) this.logger.warn(`Revalidation of ${unique.join(', ')} failed: HTTP ${response.status}`)
    } catch (error) {
      this.logger.warn(`Revalidation of ${unique.join(', ')} failed: ${error instanceof Error ? error.message : error}`)
    }
  }
}
