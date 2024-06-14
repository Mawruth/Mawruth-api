import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UploadMuseumImagesDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty()
  museumId: number;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: any[];
}
