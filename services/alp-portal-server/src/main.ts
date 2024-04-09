import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { runMigrations } from './common/data-source/db-migration'
import { getLogLevels } from './logger'
import { env } from './env'
import { useContainer } from 'class-validator'

const httpsOptions = {
  key: env.SSL_PRIVATE_KEY,
  cert: env.SSL_PUBLIC_CERT
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(),
    httpsOptions
  })
  app.useGlobalPipes(new ValidationPipe())

  await runMigrations()
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  await app.listen(env.PORT)
}
bootstrap()
