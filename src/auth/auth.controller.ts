import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { User } from '../schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { AuthenticatedUser } from './types/authenticated-user.type';
import { UserService } from '../users/user.service';
import { GenericResponse } from '../common/SLMResponses';
import { JwtAuthRefreshGuard } from './jwt-refresh-auth.guard';

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
  ): Promise<GenericResponse<Partial<User>>> {
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
      return new GenericResponse('login successful', user);
    }
    throw new UnauthorizedException('User not found');
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(200)
  async logout(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<GenericResponse<any>> {
    res.clearCookie('access_token', { path: '' });
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    const updated = await this.userService.updateRefreshToken(
      currentUser._id.toString(),
      null,
    );
    if (updated) {
      return new GenericResponse('logout successful', undefined);
    }
    throw new InternalServerErrorException('Error while trying to logout');
  }

  @UseGuards(JwtAuthRefreshGuard)
  @Post('/refresh')
  @HttpCode(200)
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<GenericResponse<any>> {
    const refreshState = await this.authService.refreshToken(
      req.cookies['refresh_token'],
    );
    if (refreshState) {
      const { token, refreshToken, user } = refreshState;
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
      return new GenericResponse('token refreshed', user);
    }
    throw new InternalServerErrorException('Token not refreshed');
  }
}
