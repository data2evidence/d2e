import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { runMigrations } from './common/data-source/db-migration'
import { getLogLevels } from './logger'
import { env } from './env'
import { useContainer } from 'class-validator'
import * as express from "express";
import {ExpressAdapter} from "@nestjs/platform-express";
import * as http from 'http'
import * as https from 'https'

const httpsOptions = {
  key: env.SSL_PRIVATE_KEY,
  cert: env.SSL_PUBLIC_CERT
}

async function bootstrap() {
  const server = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server),{
    logger: getLogLevels()//,
    //httpsOptions
  })

  
  app.useGlobalPipes(new ValidationPipe())

  await runMigrations()
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  await app.init()
  const httpServer = http.createServer(server).listen(33002);
  const httpsServer = https.createServer(httpsOptions, server).listen(env.PORT);
  console.log("started https ${env.PORT}");
}
bootstrap()
