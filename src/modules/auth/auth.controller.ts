import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-access.auth.guard';
import { JwtRefreshGuard } from '../../shared/guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() dto: RegisterAdminDto, @Res() res: Response) {
    const result = await this.authService.registerAdmin(dto);

    res.cookie('refreshToken', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.json({
      access_token: result.access_token,
      user: result.user,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto, @Res() res: Response) {
    const result = await this.authService.login(dto);

    res.cookie('refreshToken', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.json({
      access_token: result.access_token,
      user: result.user,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: Request) {
    const user = (req as any).user;
    return this.authService.findProfile(user?.id);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const user = (req as any).user;
    const { accessToken, refreshToken } = await this.authService.refresh(
      user.id,
      user.storedTokenId,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.json({
      access_token: accessToken,
      user: { id: user.id, email: user.email },
    });
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res() res: Response) {
    const user = (req as any).user;
    if (user?.storedTokenId) {
      await this.authService.logout(user.storedTokenId);
      res.clearCookie('refreshToken', { path: '/' });
    }
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
