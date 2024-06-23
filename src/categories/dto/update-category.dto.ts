import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryNameDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}

export class UpdateCategoryImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}