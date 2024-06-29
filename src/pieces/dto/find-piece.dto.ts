import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Pagination } from 'src/shared/dto/pagination';

export class FindPieceDto extends Pagination {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  user_id?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  collection?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  ar?: boolean;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  hall?: number;
}
