import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model, Types, UpdateResult } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<void> {
    try {
      const hash = bcrypt.hashSync(userDto.password, 10) as string;
      const usr = new this.userModel({ ...userDto, password: hash });
      await usr.save();
    } catch (error) {
      console.log('ISSOU');
    }
  }

  async getMe(id: mongoose.Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async getAllUsers(): Promise<User[]> {
    const usrs = await this.userModel.find();
    return usrs;
  }

  async getByEmail(email: string): Promise<User | null | undefined> {
    const usr = await this.userModel.findOne({ email }).lean().exec();
    if (usr) return usr;
    return null;
  }

  async updateRefreshToken(
    token: string,
    userId: mongoose.Types.ObjectId,
  ): Promise<boolean> {
    const requestRes = await this.userModel
      .updateOne({ _id: userId }, { refresh_token: token })
      .exec();
    if (requestRes.modifiedCount === 1) {
      return true;
    }
    return false;
  }

  async updateMe(
    id: Types.ObjectId,
    userDto: Partial<UpdateUserDto>,
  ): Promise<boolean> {
    const user = await this.userModel.updateOne({ _id: id }, userDto).exec();
    return user.modifiedCount === 1;
  }
}
