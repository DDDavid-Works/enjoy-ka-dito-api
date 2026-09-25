import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PackagesModule } from './packages/packages.module.js'
import { InquiriesModule } from './inquiries/inquiries.module.js'
import { AdminsModule } from './admins/admins.module.js'
import { AuthModule } from './auth/auth.module.js'
import { HotelsModule } from './hotels/hotels.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 5432)),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_NAME', 'enjoykadito'),
        autoLoadEntities: true,
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
    }),
    PackagesModule,
    InquiriesModule,
    AdminsModule,
    AuthModule,
    HotelsModule,
  ],
})
export class AppModule {}
