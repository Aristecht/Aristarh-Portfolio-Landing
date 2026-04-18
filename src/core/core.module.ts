import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { IS_DEV_ENV } from '../shared/utils/is-dev.util';
import { CronModule } from '../modules/cron/cron.module';
import { ProjectsModule } from '../modules/projects/projects.module';
import { PricesModule } from '../modules/prices/prices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: !IS_DEV_ENV,
    }),
    PrismaModule,
    CronModule,
    ProjectsModule,
    PricesModule,
  ],
})
export class CoreModule {}
