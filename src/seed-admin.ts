import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { AdminsService } from './admins/admins.service.js'

async function main() {
  const [email, password, name] = process.argv.slice(2)

  if (!email || !password || !name) {
    console.error('Usage: npm run seed:admin -- <email> <password> "<name>"')
    process.exit(1)
  }

  const app = await NestFactory.createApplicationContext(AppModule)
  const admins = app.get(AdminsService)

  const existing = await admins.findByEmail(email)
  if (existing) {
    console.error(`An admin with email ${email} already exists.`)
    await app.close()
    process.exit(1)
  }

  await admins.create({ email, password, name })
  console.log(`Admin account created: ${email}`)
  await app.close()
}

main()
