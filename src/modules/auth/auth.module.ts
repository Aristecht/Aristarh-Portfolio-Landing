import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenService } from './token.service';
import { JwtAccessStrategy } from './providers/jwt-access.strategy';
import { JwtRefreshStrategy } from './providers/jwt-refresh.strategy';
import { JwtAuthGuard } from '../../shared/guards/jwt-access.auth.guard';
import { JwtRefreshGuard } from '../../shared/guards/jwt-refresh.guard';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtAuthGuard,
    JwtRefreshGuard,
  ],
  exports: [TokenService],
})
export class AuthModule {}
