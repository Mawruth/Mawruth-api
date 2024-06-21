import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class HallIdDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty()
  id: number;
}
