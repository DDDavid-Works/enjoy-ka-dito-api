import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Package } from './package.entity.js'
import { CreatePackageDto } from './dto/create-package.dto.js'
import { UpdatePackageDto } from './dto/update-package.dto.js'

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packages: Repository<Package>,
  ) {}

  async findAll(options: { category?: string; includeDrafts: boolean }) {
    const where: Record<string, unknown> = {}
    if (!options.includeDrafts) where.status = 'published'
    if (options.category && options.category !== 'All') where.category = options.category

    return this.packages.find({ where, order: { createdAt: 'DESC' } })
  }

  async findBySlug(slug: string, includeDrafts: boolean) {
    const pkg = await this.packages.findOne({ where: { slug } })

    if (!pkg || (!includeDrafts && pkg.status !== 'published')) {
      throw new NotFoundException('Tour not found')
    }

    return pkg
  }

  async create(dto: CreatePackageDto) {
    const slug = dto.slug?.trim() || (await this.generateUniqueSlug(dto.title))
    return this.packages.save(this.packages.create({ ...dto, slug }))
  }

  private async generateUniqueSlug(title: string) {
    const base =
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'package'

    let slug = base
    let suffix = 2

    while (await this.packages.exists({ where: { slug } })) {
      slug = `${base}-${suffix}`
      suffix += 1
    }

    return slug
  }

  async update(id: string, dto: UpdatePackageDto) {
    const pkg = await this.packages.findOne({ where: { id } })
    if (!pkg) throw new NotFoundException('Package not found')

    return this.packages.save(this.packages.merge(pkg, dto))
  }

  async remove(id: string) {
    const result = await this.packages.delete(id)
    if (!result.affected) throw new NotFoundException('Package not found')
  }
}
