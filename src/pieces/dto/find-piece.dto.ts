import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Pagination } from 'src/shared/dto/pagination';

export class FindPieceDto extends Pagination {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}
