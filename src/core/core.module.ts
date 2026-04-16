import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { IS_DEV_ENV } from '../shared/utils/is-dev.util';
import { CronModule } from '../modules/cron/cron.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProjectsModule } from '../modules/projects/projects.module';
import { join } from 'path';
import { PricesModule } from '../modules/prices/prices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: !IS_DEV_ENV,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    PrismaModule,
    CronModule,
    ProjectsModule,
    PricesModule,
  ],
})
export class CoreModule {}
