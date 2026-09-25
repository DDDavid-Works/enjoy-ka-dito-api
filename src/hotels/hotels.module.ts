import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Hotel } from './hotel.entity.js'
import { HotelsService } from './hotels.service.js'
import { HotelsController } from './hotels.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([Hotel])],
  providers: [HotelsService],
  controllers: [HotelsController],
})
export class HotelsModule {}
