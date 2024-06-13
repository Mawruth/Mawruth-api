import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UploadMuseumImagesDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  museumId: number;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  images?: string[];
}
