import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { User } from '../schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { AuthenticatedUser } from './types/authenticated-user.type';
import { UserService } from '../users/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Partial<User> | null> {
    const loginInfo = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (loginInfo) {
      const { token, refreshToken, user } = loginInfo;
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return user;
    }
    return null;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<boolean> {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    await this.userService.logout(currentUser._id);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/refresh')
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<boolean> {
    const refreshState = await this.authService.refreshToken(
      req.cookies['refresh_token'],
    );
    if (refreshState) {
      const { token, refreshToken } = refreshState;
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    return true;
  }
}
