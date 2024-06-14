import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { MuseumReviewsService } from './museum-reviews.service';
import { CreateMuseumReviewDto } from './dto/create-museum-review.dto';
import { UpdateMuseumReviewDto } from './dto/update-museum-review.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypeGuard } from 'src/guards/user-type.guard';
import { UserTypes } from 'src/decorators/userTypes.decorator';
import { Pagination } from 'src/shared/dto/pagination';
import { MuseumIdDto } from 'src/museums/dto/museum-id.dto';

@ApiTags('museum-reviews')
@Controller('museums/:id/reviews')
export class MuseumReviewsController {
  constructor(private readonly museumReviewsService: MuseumReviewsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('USER')
  @Post()
  async create(
    @Param() museumId: MuseumIdDto,
    @Body() createMuseumReviewDto: CreateMuseumReviewDto,
    @Request() req,
  ) {
    console.log(createMuseumReviewDto);
    console.log(museumId);
    createMuseumReviewDto.museumId = museumId.id;
    createMuseumReviewDto.userId = req.user.id;
    return await this.museumReviewsService.create(createMuseumReviewDto);
  }

  @ApiOperation({
    summary: 'Get all museum reviews',
  })
  @Get()
  async findAll(
    @Param() museumId: MuseumIdDto,
    @Query() pagination: Pagination,
  ) {
    return await this.museumReviewsService.findAll(museumId.id, pagination);
  }

  @ApiOperation({
    summary: 'Get museum review by id',
    parameters: [
      {
        name: 'museumId',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
      {
        name: 'id',
        in: 'path',
        description: 'Museum review id',
        required: true,
        schema: { type: 'number' },
      },
    ],
  })
  @Get(':id')
  findOne(@Param('museumId') museumId: number, @Param('id') id: number) {
    return this.museumReviewsService.findOne(+id, +museumId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Update museum review by id',
    parameters: [
      {
        name: 'museumId',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
      {
        name: 'id',
        in: 'path',
        description: 'Museum review id',
        required: true,
        schema: { type: 'number' },
      },
    ],
  })
  @Patch(':id')
  update(
    @Param('museumId') museumId: number,
    @Param('id') id: number,
    @Body() updateMuseumReviewDto: UpdateMuseumReviewDto,
  ) {
    return this.museumReviewsService.update(
      +id,
      +museumId,
      updateMuseumReviewDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Delete museum review by id',
    parameters: [
      {
        name: 'museumId',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
      {
        name: 'id',
        in: 'path',
        description: 'Museum review id',
        required: true,
        schema: { type: 'number' },
      },
    ],
  })
  @Delete(':id')
  remove(@Param('museumId') museumId: number, @Param('id') id: string) {
    return this.museumReviewsService.remove(+id, +museumId);
  }
}
