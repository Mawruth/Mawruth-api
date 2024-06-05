import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateMuseumDto } from './create-museum.dto';

export class UpdateMuseumDto extends PartialType(CreateMuseumDto) {
}