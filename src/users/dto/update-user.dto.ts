import { ApiProperty } from '@nestjs/swagger';
import { Address } from '../../schemas/address.schema';
import { IsDate, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  birthdate: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  type: string;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  address: Address;
}
