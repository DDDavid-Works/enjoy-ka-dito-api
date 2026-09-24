import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Package } from './package.entity.js'
import { PackagesService } from './packages.service.js'
import { PackagesController } from './packages.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([Package])],
  providers: [PackagesService],
  controllers: [PackagesController],
})
export class PackagesModule {}
