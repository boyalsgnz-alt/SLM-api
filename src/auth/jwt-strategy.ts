import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';

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

  async validate(payload) {
    const user = await this.usersService.getMe(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user; // <-- this gets attached to req.user by Passport
  }
}

export default JwtStrategy;
