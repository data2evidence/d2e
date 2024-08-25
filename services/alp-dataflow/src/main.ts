import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { runMigrations } from './common/data-source/db-migration'
import { env } from './env'
import { getLogLevels } from './logger'
import { useContainer } from 'class-validator'

/*const httpsOptions = {
  key: env.SSL_PRIVATE_KEY,
  cert: env.SSL_PUBLIC_CERT,
  maxHeaderSize: 8192 * 10
}*/

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels()//,
    //httpsOptions
  })

  app.useGlobalPipes(new ValidationPipe())

  await runMigrations()
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  await app.listen(env.PORT)
}
bootstrap()
