import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Address } from '../../schemas/address.schema';

export class UserResponseDto {
  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  birthdate: Date;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  address: Address;

  @Exclude()
  __v: number;

  @Exclude()
  refresh_token: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
