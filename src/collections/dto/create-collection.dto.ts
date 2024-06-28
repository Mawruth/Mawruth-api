import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  museumId?: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
