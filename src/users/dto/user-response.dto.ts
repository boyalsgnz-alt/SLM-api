import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { Address } from '../../schemas/address.schema';
import { AddressDto } from '../../schemas/address.dto';

export class UserResponseDto {
  /* EXPOSE FIELDS */
  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  genre: string;

  @ApiProperty()
  @Expose()
  setupCompleted: boolean;

  @ApiProperty()
  @Expose()
  setupStep: number;

  @ApiProperty()
  @Expose()
  birthdate: Date;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  @Type(() => AddressDto)
  address: Address;

  /* EXCLUDE FIELDS */
  @ApiProperty()
  @Exclude()
  __v: number;

  @ApiProperty()
  @Exclude()
  refresh_token: string;

  @ApiProperty()
  @Exclude()
  password: string;

  @ApiProperty()
  @Exclude()
  createdAt: Date;

  @ApiProperty()
  @Exclude()
  updatedAt: Date;
}
