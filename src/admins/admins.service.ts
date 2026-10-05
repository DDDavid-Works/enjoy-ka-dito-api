import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Admin } from './admin.entity.js'
import type { CreateUserDto } from './dto/create-user.dto.js'
import type { UpdateUserDto } from './dto/update-user.dto.js'
import type { ChangePasswordDto } from './dto/change-password.dto.js'

// Never send passwordHash to the client.
function toUser(admin: Admin) {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    contactNumber: admin.contactNumber ?? null,
    createdAt: admin.createdAt,
  }
}

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly admins: Repository<Admin>,
  ) {}

  findByEmail(email: string) {
    return this.admins.findOne({ where: { email } })
  }

  findById(id: string) {
    return this.admins.findOne({ where: { id } })
  }

  async create(data: { email: string; password: string; name: string; contactNumber?: string }) {
    const passwordHash = await bcrypt.hash(data.password, 12)
    return this.admins.save(
      this.admins.create({
        email: data.email,
        passwordHash,
        name: data.name,
        contactNumber: data.contactNumber || undefined,
      }),
    )
  }

  count() {
    return this.admins.count()
  }

  async findAll() {
    const users = await this.admins.find({ order: { name: 'ASC' } })
    return users.map(toUser)
  }

  async getOne(id: string) {
    return toUser(await this.requireById(id))
  }

  async createUser(dto: CreateUserDto) {
    const email = dto.email.trim()
    if (await this.findByEmail(email)) throw new ConflictException('A user with this email already exists.')
    return toUser(await this.create({ ...dto, email, name: dto.name.trim() }))
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.requireById(id)

    if (dto.email !== undefined) {
      const email = dto.email.trim()
      const existing = await this.findByEmail(email)
      if (existing && existing.id !== id) throw new ConflictException('A user with this email already exists.')
      user.email = email
    }
    if (dto.name !== undefined) user.name = dto.name.trim()
    if (dto.contactNumber !== undefined) user.contactNumber = dto.contactNumber.trim() || null

    return toUser(await this.admins.save(user))
  }

  async changePassword(id: string, dto: ChangePasswordDto, actingUserId: string) {
    const user = await this.requireById(id)

    // Changing your own password needs the current one; resetting someone else's doesn't.
    if (id === actingUserId) {
      if (!dto.currentPassword) throw new BadRequestException('Enter your current password.')
      if (!(await bcrypt.compare(dto.currentPassword, user.passwordHash))) {
        throw new UnauthorizedException('Current password is incorrect.')
      }
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 12)
    await this.admins.save(user)
  }

  async remove(id: string, actingUserId: string) {
    if (id === actingUserId) throw new BadRequestException("You can't delete your own account.")
    const result = await this.admins.delete(id)
    if (!result.affected) throw new NotFoundException('User not found')
  }

  private async requireById(id: string) {
    const user = await this.findById(id)
    if (!user) throw new NotFoundException('User not found')
    return user
  }
}
