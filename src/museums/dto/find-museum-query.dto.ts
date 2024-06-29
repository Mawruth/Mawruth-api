import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional } from 'class-validator';
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
  category?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  city?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  user_id?: number;
}
