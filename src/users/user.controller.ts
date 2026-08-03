import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userDto: CreateUserDto): Promise<void> {
    await this.userService.createUser(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
}
