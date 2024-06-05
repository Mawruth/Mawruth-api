import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditMuseumDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	name?: string

	@ApiProperty()
	@IsString()
	@IsOptional()
	description?: string

	@ApiProperty()
	@IsString()
	@IsOptional()
	city?: string

	@ApiProperty()
	@IsString()
	@IsOptional()
	street?: string
}