import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Admin } from './admin.entity.js'

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

  async create(data: { email: string; password: string; name: string }) {
    const passwordHash = await bcrypt.hash(data.password, 12)
    return this.admins.save(
      this.admins.create({ email: data.email, passwordHash, name: data.name }),
    )
  }

  count() {
    return this.admins.count()
  }
}
