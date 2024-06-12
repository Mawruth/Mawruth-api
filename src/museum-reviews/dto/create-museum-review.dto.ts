import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMuseumReviewDto {
	@ApiProperty()
	@IsOptional()
	@IsInt()
	museumId: number

	@ApiProperty()
	@IsNotEmpty()
	@IsInt()
	userId: number

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	rating: number

	@ApiProperty()
	@IsOptional()
	@IsString()
	content: string
}
