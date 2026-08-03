import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { User, UserDocument } from '../schemas/user.schema';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<object | null> {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      return null;
    }
    const compare = (await bcrypt.compare(pass, user.password)) as boolean;
    if (compare) {
      const { password, ...result } = user;
      return this.login(result);
    }
    return null;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { username: user.email, sub: user._id.toString() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
