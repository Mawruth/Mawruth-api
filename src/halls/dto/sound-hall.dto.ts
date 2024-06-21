import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SoundHallDto {
  hallId: number;
  @ApiProperty({ type: 'string', format: 'binary' })
  audio: any;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image?: any;
}
