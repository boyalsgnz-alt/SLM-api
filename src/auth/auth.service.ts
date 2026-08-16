import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { User } from '../schemas/user.schema';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { generateTokenPair } from '../utils/generateTokenPair';

type LoginObject = {
  user: Partial<User>;
  token: string;
  refreshToken: string;
};

type JwtPayload = {
  sub: string;
  aud: string;
  iss: string;
  iat: number;
  exp: number;
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
    const { tokenPayload, refreshTokenPayload } = generateTokenPair(
      user._id.toString(),
    );
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
    });
    const token = this.jwtService.sign(tokenPayload);
    await this.userService.updateRefreshToken(
      user._id.toString(),
      refreshToken,
    );
    return {
      token,
      refreshToken,
    };
  }

  async refreshToken(oldToken: string) {
    const decodedToken = this.jwtService.decode<JwtPayload>(oldToken);
    const usr = await this.userService.getMeById(decodedToken.sub);
    if (!usr) {
      return null;
    }
    const { tokenPayload, refreshTokenPayload } = generateTokenPair(
      usr._id.toString(),
    );
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
    });
    const token = this.jwtService.sign(tokenPayload);
    await this.userService.updateRefreshToken(usr._id.toString(), refreshToken);
    const { password, ...user } = usr;
    return {
      token,
      refreshToken,
      user,
    };
  }
}
