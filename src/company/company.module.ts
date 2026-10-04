import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CompanyDetails } from './company-details.entity.js'
import { CompanyService } from './company.service.js'
import { CompanyController } from './company.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([CompanyDetails])],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
