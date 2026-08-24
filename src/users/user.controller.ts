import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { GenericResponse } from '../common/SLMResponses';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userDto: CreateUserDto): Promise<void> {
    await this.userService.createUser(userDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin'])
  @Get()
  async getAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async getMe(
    @CurrentUser() user: User,
  ): Promise<GenericResponse<UserResponseDto>> {
    const usr = await this.userService.getMeById(user._id.toString());
    return new GenericResponse(
      'User found',
      plainToInstance(UserResponseDto, usr),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  @HttpCode(HttpStatus.OK)
  async patchMe(
    @CurrentUser() user: User,
    @Body() userDto: Partial<UpdateUserDto>,
  ): Promise<GenericResponse<UserResponseDto>> {
    const usr = await this.userService.updateMe(user._id, userDto);
    return new GenericResponse(
      'User updated',
      plainToInstance(UserResponseDto, usr),
    );
  }
}
