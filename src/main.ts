import { existsSync } from 'fs';
import { resolve } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { CoreModule } from './core/core.module';

const uploadPathCandidates = [
  resolve(process.cwd(), 'uploads'),
  resolve(__dirname, '..', 'uploads'),
  resolve(__dirname, '..', '..', 'uploads'),
];

const uploadsDir =
  uploadPathCandidates.find(candidate => existsSync(candidate)) ||
  uploadPathCandidates[0];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(CoreModule, {
    rawBody: true,
  });

  const config = app.get(ConfigService);
  const apiPrefix = config.get<string>('API_PREFIX') ?? 'api';

  app.setGlobalPrefix(apiPrefix);

  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads',
  });

  app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')));

  app.use(passport.initialize());
  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}
void bootstrap();
