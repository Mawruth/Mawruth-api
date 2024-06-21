import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStoryDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	content: string;

	@ApiProperty()
	@IsNumber()
	museumId?: number;

	@ApiProperty()
	@IsOptional()
	image?: string;
}
