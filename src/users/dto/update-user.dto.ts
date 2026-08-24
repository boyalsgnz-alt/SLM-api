import { ApiProperty } from '@nestjs/swagger';
import { Address } from '../../schemas/address.schema';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

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
  genre: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  type: string;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  address: Address;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  setupStep: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  setupCompleted: boolean;
}
