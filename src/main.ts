import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { CoreModule } from './core/core.module';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule, {
    rawBody: true,
  });

  const config = app.get(ConfigService);

  app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')));

  app.use(passport.initialize());
  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposesHeaders: ['Set-Cookie'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}
void bootstrap();
