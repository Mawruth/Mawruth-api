import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { Pagination } from 'src/shared/dto/pagination';

export class FindMuseumQueryDto extends Pagination {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  category?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  city?: string;
}
