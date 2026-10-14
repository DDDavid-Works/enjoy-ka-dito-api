// Loads the Express.Multer.File types (TypeScript 6 no longer includes @types packages automatically).
import type {} from 'multer'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import sharp from 'sharp'
import { Media } from './media.entity.js'

const MAX_WIDTH = 2000
// The admin form already shrinks photos in the browser, so anything near these limits is not from the form.
// They keep a small hosting plan safe from decoding huge images (a 25 megapixel image is ~100 MB in memory).
const MAX_INPUT_PIXELS = 25_000_000

// One image at a time, using one thread and no pixel cache: slower under load, but memory stays predictable.
sharp.concurrency(1)
sharp.cache(false)
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

@Injectable()
export class MediaService {
  private queue: Promise<unknown> = Promise.resolve()

  constructor(
    @InjectRepository(Media)
    private readonly media: Repository<Media>,
  ) {}

  // Shrinks to a web-friendly JPEG. Normally receives the small file the admin form already prepared in the browser.
  async upload(file: Express.Multer.File | undefined) {
    if (!file) throw new BadRequestException('Choose an image to upload.')
    if (!ALLOWED_TYPES.has(file.mimetype)) throw new BadRequestException('Only JPEG, PNG or WebP images are allowed.')

    let processed: { data: Buffer; info: sharp.OutputInfo }
    try {
      processed = await this.inQueue(() =>
        sharp(file.buffer, { limitInputPixels: MAX_INPUT_PIXELS, sequentialRead: true })
          .rotate() // honor the camera's orientation, then drop the EXIF data
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .flatten({ background: '#ffffff' }) // transparent PNGs become white instead of black
          .jpeg({ quality: 82, progressive: true }) // mozjpeg compresses ~10% better but is much slower
          .toBuffer({ resolveWithObject: true }),
      )
    } catch {
      throw new BadRequestException('That file could not be read as an image (or it is too large in pixels).')
    }

    const saved = await this.media.save(
      this.media.create({
        contentType: 'image/jpeg',
        width: processed.info.width,
        height: processed.info.height,
        data: processed.data,
        originalName: file.originalname?.slice(0, 200),
      }),
    )

    return { id: saved.id, width: saved.width, height: saved.height, size: processed.data.length }
  }

  private inQueue<T>(task: () => Promise<T>): Promise<T> {
    const run = this.queue.then(task, task)
    this.queue = run.catch(() => undefined)
    return run
  }

  async find(id: string) {
    // Ids are uuids; anything else can't exist (and would make Postgres throw).
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new NotFoundException()
    const found = await this.media.findOne({ where: { id } })
    if (!found) throw new NotFoundException()
    return found
  }
}
