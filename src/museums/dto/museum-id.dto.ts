import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class MuseumIdDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id: number;
}
