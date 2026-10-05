import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Admin } from './admin.entity.js'
import { AdminsService } from './admins.service.js'
import { UsersController } from './users.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [AdminsService],
  controllers: [UsersController],
  exports: [AdminsService],
})
export class AdminsModule {}
