import type {} from 'multer'
import { Controller, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Request, Response } from 'express'
import { MediaService } from './media.service.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { AppModule, RequireModules } from '../auth/modules.js'
import { ModulesGuard } from '../auth/modules.guard.js'

@Controller('media')
export class MediaController {
  constructor(private readonly media: MediaService) {}

  // Returns the public URL to save in a package's image field.
  @UseGuards(JwtAuthGuard, ModulesGuard)
  @RequireModules(AppModule.Packages)
  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 6 * 1024 * 1024, files: 1 } }))
  async upload(@UploadedFile() file: Express.Multer.File | undefined, @Req() req: Request) {
    const result = await this.media.upload(file)
    // Behind Railway's proxy the public scheme/host arrive in the x-forwarded-* headers.
    const proto = (req.headers['x-forwarded-proto'] as string | undefined)?.split(',')[0] ?? req.protocol
    const host = (req.headers['x-forwarded-host'] as string | undefined)?.split(',')[0] ?? req.get('host')
    const base = process.env.API_PUBLIC_URL?.replace(/\/$/, '') ?? `${proto}://${host}`
    return { ...result, url: `${base}/media/${result.id}` }
  }

  // Public: the website and package pages load these. The id never changes content, so cache it for a year.
  @Get(':id')
  async serve(@Param('id') id: string, @Res() res: Response) {
    const found = await this.media.find(id)
    res.set({
      'Content-Type': found.contentType,
      'Content-Length': String(found.data.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    })
    res.send(found.data)
  }
}
