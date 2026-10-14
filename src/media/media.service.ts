// Loads the Express.Multer.File types (TypeScript 6 no longer includes @types packages automatically).
import type {} from 'multer'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import sharp from 'sharp'
import { Media } from './media.entity.js'

const MAX_WIDTH = 2000
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly media: Repository<Media>,
  ) {}

  // Photos straight from a phone or the old website are often ~10 MB: shrink to a web-friendly JPEG.
  async upload(file: Express.Multer.File | undefined) {
    if (!file) throw new BadRequestException('Choose an image to upload.')
    if (!ALLOWED_TYPES.has(file.mimetype)) throw new BadRequestException('Only JPEG, PNG or WebP images are allowed.')

    let processed: { data: Buffer; info: sharp.OutputInfo }
    try {
      processed = await sharp(file.buffer)
        .rotate() // honor the camera's orientation, then drop the EXIF data
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .flatten({ background: '#ffffff' }) // transparent PNGs become white instead of black
        .jpeg({ quality: 82, progressive: true, mozjpeg: true })
        .toBuffer({ resolveWithObject: true })
    } catch {
      throw new BadRequestException('That file could not be read as an image.')
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

  async find(id: string) {
    // Ids are uuids; anything else can't exist (and would make Postgres throw).
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new NotFoundException()
    const found = await this.media.findOne({ where: { id } })
    if (!found) throw new NotFoundException()
    return found
  }
}
