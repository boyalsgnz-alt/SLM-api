import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../schemas/user.schema';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<object | null> {
    const token = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return token;
  }
}
