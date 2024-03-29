import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger } from './logger';
import { env } from './env';
import { updateDb } from './db/runner';

const logger = createLogger('Terminology');

async function runNestApp() {
  await updateDb();
  const nestApp = await NestFactory.create(AppModule);
  await nestApp.listen(env.TERMINOLOGY_SVC__PORT || 41108);
  logger.info(
    `Terminology service started on port ${env.TERMINOLOGY_SVC__PORT || 41108}`,
  );
}

async function bootstrap() {
  await runNestApp();
}
bootstrap();
