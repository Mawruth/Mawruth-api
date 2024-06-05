import { Body, Controller, Post, Get, Delete, UseGuards, Query, Param, Patch } from '@nestjs/common';
import { CreateMuseumDto } from './dto/create-museum.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MuseumsService } from './museums.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateMuseumDto } from './dto/update-museum.dto';
import { UserTypeGuard } from 'src/guards/user-type.guard';
import { UserTypes } from 'src/decorators/userTypes.decorato';

@ApiTags('museums')
@Controller('museums')
export class MuseumsController {
  constructor(private readonly service: MuseumsService) { }

  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes("SUPPER_ADMIN")
  @Post()
  @ApiOperation({
    summary: 'Create new museum',
  })
  @ApiBearerAuth()
  async create(@Body() createMuseumDto: CreateMuseumDto) {
    return this.service.createMuseum(createMuseumDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all museums',
    parameters: [
      {
        name: 'page',
        in: 'query',
        description: 'Page number',
        required: false,
        schema: { type: 'number' }
      },
      {
        name: 'limit',
        in: 'query',
        description: 'Limit number',
        required: false,
        schema: { type: 'number' }
      },
      {
        name: 'search',
        in: 'query',
        description: 'Search by name',
        required: false,
        schema: { type: 'string' }
      },
    ]
  })
  @ApiBearerAuth()
  async getAll(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("search") search: string,
  ) {
    return this.service.getAllMuseums(page, limit, search);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get museum by id',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' }
      },
    ]
  })
  @ApiBearerAuth()
  async getById(@Param('id') id: number) {
    return this.service.getMuseumById(id);
  }

  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes("SUPPER_ADMIN")
  @Patch(':id')
  @ApiOperation({
    summary: 'Edit museum by id',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' }
      },
    ]
  })
  @ApiBearerAuth()
  async editMuseum(
    @Param('id') id: number,
    @Body() editMuseumDto: UpdateMuseumDto,
  ) {
    return this.service.editMuseum(id, editMuseumDto);
  }

  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes("SUPPER_ADMIN")
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete museum by id',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' }
      },
    ]
  })
  @ApiBearerAuth()
  async deleteMuseum(@Param('id') id: number) {
    return this.service.deleteMuseum(id);
  }
}
