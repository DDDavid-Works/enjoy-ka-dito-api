import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Package } from './package.entity.js'
import { CreatePackageDto } from './dto/create-package.dto.js'
import { UpdatePackageDto } from './dto/update-package.dto.js'
import { RevalidationService } from '../revalidation/revalidation.service.js'

// Quotation data is internal; strip it for anonymous (website) requests.
function toPublic(pkg: Package) {
  const {
    quotationInclusions: _quotationInclusions,
    quotationAccommodations: _quotationAccommodations,
    quotationExclusions: _quotationExclusions,
    quotationOptionalTours: _quotationOptionalTours,
    quotationInclusionNotes: _quotationInclusionNotes,
    ...rest
  } = pkg
  return rest
}

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packages: Repository<Package>,
    private readonly revalidation: RevalidationService,
  ) {}

  async findAll(options: { category?: string; includeDrafts: boolean }) {
    const where: Record<string, unknown> = {}
    if (!options.includeDrafts) where.status = 'published'
    if (options.category && options.category !== 'All') where.category = options.category

    const found = await this.packages.find({ where, order: { createdAt: 'DESC' } })
    return options.includeDrafts ? found : found.map(toPublic)
  }

  async findBySlug(slug: string, includeDrafts: boolean) {
    const pkg = await this.packages.findOne({ where: { slug } })

    if (!pkg || (!includeDrafts && pkg.status !== 'published')) {
      throw new NotFoundException('Tour not found')
    }

    return includeDrafts ? pkg : toPublic(pkg)
  }

  async create(dto: CreatePackageDto) {
    const slug = dto.slug?.trim() || (await this.generateUniqueSlug(dto.title))
    const saved = await this.packages.save(this.packages.create({ ...dto, slug }))
    void this.revalidation.revalidate(['packages', `package:${saved.slug}`])
    return saved
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

    const previousSlug = pkg.slug
    const saved = await this.packages.save(this.packages.merge(pkg, dto))
    // Both slugs: if the slug changed, the old URL must stop serving the package.
    void this.revalidation.revalidate(['packages', `package:${previousSlug}`, `package:${saved.slug}`])
    return saved
  }

  async remove(id: string) {
    const pkg = await this.packages.findOne({ where: { id } })
    const result = await this.packages.delete(id)
    if (!result.affected) throw new NotFoundException('Package not found')
    void this.revalidation.revalidate(['packages', ...(pkg ? [`package:${pkg.slug}`] : [])])
  }
}
