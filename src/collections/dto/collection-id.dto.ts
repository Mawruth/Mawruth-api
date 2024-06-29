import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CollectionIdDto {
  @ApiProperty()
  @Type(() => Number)
  collection_id: number;
}
