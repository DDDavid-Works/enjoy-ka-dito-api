import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Admin } from './admin.entity.js'
import { AdminsService } from './admins.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
