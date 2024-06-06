import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePieceDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string

	@IsString()
	@IsOptional()
	@ApiProperty()
	description?: string

	@IsBoolean()
	@IsNotEmpty()
	@ApiProperty()
	isMasterpiece: boolean

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	age: string

	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	@ApiProperty()
	museumId: number

	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	@ApiProperty()
	sectionId: number

	@ApiProperty()
	@IsString()
	@IsOptional()
	@ApiProperty()
	arPath?: string
}
