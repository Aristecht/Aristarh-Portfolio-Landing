import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../core/prisma/prisma.service';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async generateTokenPair(userId: string): Promise<TokenPair> {
    const payload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      },
    );

    const tokenHash = await bcrypt.hash(refreshToken, 10);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  async rotateTokens(
    storedTokenId: string,
    userId: string,
  ): Promise<TokenPair> {
    await this.prisma.refreshToken.delete({ where: { id: storedTokenId } });
    return this.generateTokenPair(userId);
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const storedTokens = await this.prisma.refreshToken.findMany();
    for (const storedToken of storedTokens) {
      const isValid = await bcrypt.compare(refreshToken, storedToken.tokenHash);
      if (isValid) {
        await this.prisma.refreshToken.delete({
          where: { id: storedToken.id },
        });
        return;
      }
    }
  }

  async revokeRefreshTokenById(storedTokenId: string): Promise<void> {
    await this.prisma.refreshToken.delete({ where: { id: storedTokenId } });
  }

  async purgeExpiredTokens(): Promise<number> {
    const { count } = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return count;
  }
}
