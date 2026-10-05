import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AdminsService } from './admins.service.js'
import { CreateUserDto } from './dto/create-user.dto.js'
import { UpdateUserDto } from './dto/update-user.dto.js'
import { ChangePasswordDto } from './dto/change-password.dto.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { CurrentAdmin, type CurrentAdminPayload } from '../auth/current-admin.decorator.js'

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly admins: AdminsService) {}

  @Get()
  findAll() {
    return this.admins.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.admins.getOne(id)
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.admins.createUser(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.admins.update(id, dto)
  }

  @Patch(':id/password')
  @HttpCode(204)
  async changePassword(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDto,
    @CurrentAdmin() current: CurrentAdminPayload,
  ) {
    await this.admins.changePassword(id, dto, current.id)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @CurrentAdmin() current: CurrentAdminPayload) {
    await this.admins.remove(id, current.id)
  }
}
