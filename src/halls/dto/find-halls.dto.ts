import { IsOptional, IsString } from 'class-validator';
import { Pagination } from 'src/shared/dto/pagination';

export class FindHallsDto extends Pagination {
  @IsString()
  @IsOptional()
  name?: string;
}
