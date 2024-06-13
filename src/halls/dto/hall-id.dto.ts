import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class HallIdDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  id: number;
}
