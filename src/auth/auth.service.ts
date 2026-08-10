import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { User, UserDocument } from '../schemas/user.schema';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';

type LoginObject = {
  user: Partial<User>;
  token: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<LoginObject | null> {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      return null;
    }
    const compare = (await bcrypt.compare(pass, user.password)) as boolean;
    if (compare) {
      const { password, ...result } = user;
      const login = await this.login(result);
      return {
        ...login,
        user: result,
      };
    }
    return null;
  }

  async login(user: Omit<User, 'password'>) {
    const issuedAt = new Date();
    const tokenExpAt = new Date();
    const refreshExpAt = new Date();
    tokenExpAt.setMinutes(tokenExpAt.getMinutes() + 15);
    refreshExpAt.setHours(refreshExpAt.getHours() + 24 * 7);
    const tokenPayload = {
      sub: user._id.toString(),
      aud: 'SLMAPI',
      iss: 'SLMAPI',
      iat: Math.floor(issuedAt.getTime() / 1000),
      exp: Math.floor(tokenExpAt.getTime() / 1000),
    };
    const refreshTokenPayload = {
      sub: user._id.toString(),
      aud: 'SLMAPI',
      iss: 'SLMAPI',
      iat: Math.floor(issuedAt.getTime() / 1000),
      exp: Math.floor(refreshExpAt.getTime() / 1000),
    };
    return {
      token: this.jwtService.sign(tokenPayload),
      refreshToken: this.jwtService.sign(refreshTokenPayload, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      }),
    };
  }
}
