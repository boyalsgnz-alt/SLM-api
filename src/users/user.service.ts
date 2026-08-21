import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<void> {
    try {
      const hash = bcrypt.hashSync(userDto.password, 10);
      const usr = new this.userModel({ ...userDto, password: hash });
      await usr.save();
    } catch (error) {
      console.log(error);
    }
  }

  async getMeById(id: string): Promise<User | null> {
    return this.userModel.findById(id).lean().exec();
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
    userId: string,
    newToken: string | null,
  ): Promise<boolean> {
    const requestRes = await this.userModel
      .updateOne({ _id: userId }, { refresh_token: newToken })
      .exec();
    return requestRes.modifiedCount === 1;
  }

  async updateMe(
    id: Types.ObjectId,
    userDto: Partial<UpdateUserDto>,
  ): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate(
        { _id: id },
        { $set: userDto },
        { returnDocument: 'after' },
      )
      .lean()
      .exec();
    if (user) {
      return user;
    }
    throw new NotFoundException(`User not found`);
  }
}
