import { Body, Controller, Post } from '@nestjs/common';
import { CreateMuseumDto } from './dto/create-museum.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('museums')
@Controller('museums')
export class MuseumsController {
  @Post()
  create(@Body() createMuseumDto: CreateMuseumDto) {
    return createMuseumDto;
  }
}
