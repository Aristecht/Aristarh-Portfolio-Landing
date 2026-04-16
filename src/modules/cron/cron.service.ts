import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokenService } from '../auth/token.service';

@Injectable()
export class CronService {
  constructor(private tokenService: TokenService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleExpiredTokens() {
    const count = await this.tokenService.purgeExpiredTokens();
    console.log(`Purged ${count} expired refresh tokens`);
  }
}
