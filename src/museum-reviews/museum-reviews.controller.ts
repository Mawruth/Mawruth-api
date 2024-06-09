import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MuseumReviewsService } from './museum-reviews.service';
import { CreateMuseumReviewDto } from './dto/create-museum-review.dto';
import { UpdateMuseumReviewDto } from './dto/update-museum-review.dto';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypeGuard } from 'src/guards/user-type.guard';
import { UserTypes } from 'src/decorators/userTypes.decorato';

@ApiTags("museum-reviews")
@Controller('museums/:museumId/reviews')
export class MuseumReviewsController {
  constructor(private readonly museumReviewsService: MuseumReviewsService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes("SUPPER_ADMIN")
  @ApiOperation({
    summary: 'Create new museum review',
    parameters: [
      {
        name: 'museumId',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' }
      }
    ]
  })
  @Post()
  async create(
    @Body() createMuseumReviewDto: CreateMuseumReviewDto,
    @Param('museumId') museumId: number,
  ) {
    createMuseumReviewDto.museumId = +museumId
    return this.museumReviewsService.create(createMuseumReviewDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all museum reviews',
    parameters: [
      {
        name: 'museumId',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' }
      },
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
    ]
  })
  @Get()
  findAll(
    @Param('museumId') museumId: number,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    return this.museumReviewsService.findAll(museumId, page, limit);
  }

  @ApiOperation({
    summary: 'Get museum review by id',
    parameters: [
      {
        name: 'museumId',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' }
      },
      {
        name: 'id',
        in: 'path',
        description: 'Museum review id',
        required: true,
        schema: { type: 'number' }
      },
    ]
  })
  @Get(':id')
  findOne(
    @Param('museumId') museumId: number,
    @Param('id') id: number,
  ) {
    return this.museumReviewsService.findOne(+id, +museumId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes("SUPPER_ADMIN")
  @ApiOperation({
    summary: 'Update museum review by id',
    parameters: [
      {
        name: 'museumId',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' }
      },
      {
        name: 'id',
        in: 'path',
        description: 'Museum review id',
        required: true,
        schema: { type: 'number' }
      },
    ]
  })
  @Patch(':id')
  update(
    @Param('museumId') museumId: number,
    @Param('id') id: number,
    @Body() updateMuseumReviewDto: UpdateMuseumReviewDto
  ) {
    return this.museumReviewsService.update(+id, +museumId, updateMuseumReviewDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes("SUPPER_ADMIN")
  @ApiOperation({
    summary: 'Delete museum review by id',
    parameters: [
      {
        name: 'museumId',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' }
      },
      {
        name: 'id',
        in: 'path',
        description: 'Museum review id',
        required: true,
        schema: { type: 'number' }
      },
    ]
  })
  @Delete(':id')
  remove(
    @Param('museumId') museumId: number,
    @Param('id') id: string
  ) {
    return this.museumReviewsService.remove(+id, +museumId);
  }
}
