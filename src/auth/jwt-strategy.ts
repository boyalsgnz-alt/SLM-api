import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { AuthenticatedUser } from './types/authenticated-user.type';

const testExtract = (req: Request): string => {
  return req.cookies.access_token;
};

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([testExtract]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload): Promise<AuthenticatedUser> {
    const user = await this.usersService.getMe(payload.sub);
    if (!user) throw new UnauthorizedException();
    return { _id: user._id, email: user.email };
  }
}

export default JwtStrategy;
