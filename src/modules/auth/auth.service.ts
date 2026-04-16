import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { LoginUserDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async login(dto: LoginUserDto) {
    const { email, password } = dto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Неверно заполнены поля');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Неверно заполнены поля');
    }

    const tokens = await this.tokenService.generateTokenPair(user.id);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user: { id: user.id, email: user.email },
    };
  }

  async registerAdmin(dto: RegisterAdminDto) {
    const existingUsers = await this.prismaService.user.count();
    if (existingUsers > 0) {
      throw new ForbiddenException('Администратор уже зарегистрирован');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });

    const tokens = await this.tokenService.generateTokenPair(user.id);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user: { id: user.id, email: user.email },
    };
  }

  async findProfile(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    return user;
  }

  async refresh(userId: string, storedTokenId: string) {
    return this.tokenService.rotateTokens(storedTokenId, userId);
  }

  async logout(storedTokenId: string) {
    await this.tokenService.revokeRefreshTokenById(storedTokenId);
    return true;
  }
}
