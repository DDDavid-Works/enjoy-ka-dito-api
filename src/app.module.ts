import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PackagesModule } from './packages/packages.module.js'
import { InquiriesModule } from './inquiries/inquiries.module.js'
import { AdminsModule } from './admins/admins.module.js'
import { AuthModule } from './auth/auth.module.js'
import { HotelsModule } from './hotels/hotels.module.js'
import { QuotationsModule } from './quotations/quotations.module.js'
import { CompanyModule } from './company/company.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // Hosted databases (Railway) hand out one DATABASE_URL; locally we use the separate DB_* values.
        const databaseUrl = config.get<string>('DATABASE_URL')
        const connection = databaseUrl
          ? { url: databaseUrl }
          : {
              host: config.get('DB_HOST', 'localhost'),
              port: Number(config.get('DB_PORT', 5432)),
              username: config.get('DB_USERNAME', 'postgres'),
              password: config.get('DB_PASSWORD', 'postgres'),
              database: config.get('DB_NAME', 'enjoykadito'),
            }

        // DB_SYNCHRONIZE creates/updates tables from the entities on startup. It defaults to on
        // outside production; set DB_SYNCHRONIZE=true to create the tables on a first deploy,
        // then switch it off once the schema is in place.
        const synchronize = config.get('DB_SYNCHRONIZE')
        return {
          type: 'postgres' as const,
          ...connection,
          ssl: config.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : undefined,
          autoLoadEntities: true,
          synchronize: synchronize === undefined ? config.get('NODE_ENV') !== 'production' : synchronize === 'true',
        }
      },
    }),
    PackagesModule,
    InquiriesModule,
    AdminsModule,
    AuthModule,
    HotelsModule,
    QuotationsModule,
    CompanyModule,
  ],
})
export class AppModule {}
