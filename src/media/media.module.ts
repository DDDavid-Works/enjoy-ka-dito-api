import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Media } from './media.entity.js'
import { MediaService } from './media.service.js'
import { MediaController } from './media.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
