import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // CORS_ORIGIN is a comma-separated list of allowed site addresses; unset allows any origin.
  const origins = process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean)
  app.enableCors(origins?.length ? { origin: origins } : undefined)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  const port = process.env.PORT ? Number(process.env.PORT) : 4000
  await app.listen(port)
  console.log(`api listening on http://localhost:${port}`)
}

bootstrap()
