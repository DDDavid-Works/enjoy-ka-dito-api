import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { PackagesService } from './packages.service.js'
import { CreatePackageDto } from './dto/create-package.dto.js'
import { UpdatePackageDto } from './dto/update-package.dto.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard.js'
import { CurrentAdmin, type CurrentAdminPayload } from '../auth/current-admin.decorator.js'

@Controller('packages')
export class PackagesController {
  constructor(private readonly packages: PackagesService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(@Query('category') category: string | undefined, @CurrentAdmin() admin?: CurrentAdminPayload) {
    return this.packages.findAll({ category, includeDrafts: Boolean(admin) })
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':slug')
  findOne(@Param('slug') slug: string, @CurrentAdmin() admin?: CurrentAdminPayload) {
    return this.packages.findBySlug(slug, Boolean(admin))
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePackageDto) {
    return this.packages.create(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePackageDto) {
    return this.packages.update(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packages.remove(id)
  }
}
