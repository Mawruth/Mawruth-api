import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  UseGuards,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { CreateMuseumDto } from './dto/create-museum.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MuseumsService } from './museums.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateMuseumDto } from './dto/update-museum.dto';
import { UserTypeGuard } from 'src/guards/user-type.guard';
import { UserTypes } from 'src/decorators/userTypes.decorator';
import { FindMuseumQueryDto } from './dto/find-museum-query.dto';
import { MuseumIdDto } from './dto/museum-id.dto';

@ApiTags('museums')
@Controller('museums')
export class MuseumsController {
  constructor(private readonly service: MuseumsService) {}

  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @Post()
  @ApiOperation({
    summary: 'Create new museum',
  })
  @ApiBearerAuth()
  async create(@Body() createMuseumDto: CreateMuseumDto) {
    return this.service.createMuseum(createMuseumDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all museums',
  })
  async getAll(@Query() query: FindMuseumQueryDto) {
    return this.service.getAllMuseums(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get museum by id',
  })
  async getById(@Param() museumId: MuseumIdDto) {
    console.log(museumId.id);
    return await this.service.getMuseumById(museumId.id);
  }

  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @Patch(':id')
  @ApiOperation({
    summary: 'Edit museum by id',
  })
  @ApiBearerAuth()
  async editMuseum(
    @Param() museumId: MuseumIdDto,
    @Body() editMuseumDto: UpdateMuseumDto,
  ) {
    return this.service.editMuseum(museumId.id, editMuseumDto);
  }

  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete museum by id',
  })
  @ApiBearerAuth()
  async deleteMuseum(@Param() museumId: MuseumIdDto) {
    return this.service.deleteMuseum(museumId.id);
  }
}
