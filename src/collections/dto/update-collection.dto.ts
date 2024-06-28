import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCollectionNameDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}

export class UpdateCollectionImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}