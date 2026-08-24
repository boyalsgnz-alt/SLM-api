import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  street: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  apt_unit: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  postcode: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  state: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  country: string;
}
