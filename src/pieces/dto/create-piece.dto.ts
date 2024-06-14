import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreatePieceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  isMasterpiece: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  age: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  museumId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  hallId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @ApiProperty()
  arPath?: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
