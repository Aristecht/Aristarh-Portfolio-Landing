import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import type { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        req => req.cookies?.refreshToken,
      ]),
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string }) {
    const rawToken = req.cookies?.refreshToken;
    if (!rawToken) {
      throw new UnauthorizedException('Нет refresh токена');
    }

    const tokens = await this.prismaService.refreshToken.findMany({
      where: {
        userId: payload.sub,
      },
      include: { user: true },
    });

    if (tokens.length === 0) {
      throw new UnauthorizedException('Refresh токен не найден');
    }

    let stored = null;
    for (const token of tokens) {
      const isTokenValid = await bcrypt.compare(rawToken, token.tokenHash);
      if (isTokenValid) {
        stored = token;
        break;
      }
    }

    if (!stored) {
      throw new UnauthorizedException('Refresh токен невалиден');
    }

    if (stored.expiresAt < new Date()) {
      await this.prismaService.refreshToken.delete({
        where: { id: stored.id },
      });
      throw new UnauthorizedException('Refresh токен истек');
    }

    if (stored.userId !== payload.sub) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    return { ...stored.user, storedTokenId: stored.id };
  }
}
