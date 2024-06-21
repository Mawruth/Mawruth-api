import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFiles, ParseFilePipe, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypeGuard } from 'src/guards/user-type.guard';
import { UserTypes } from 'src/decorators/userTypes.decorator';
import { Stories } from '@prisma/client';
import { Pagination } from 'src/shared/dto/pagination';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureBlobService } from 'src/services/azure-blob.service';

@ApiTags('stories')
@Controller('museums/:id/stories')
export class StoriesController {
  constructor(
    private readonly storiesService: StoriesService,
    private readonly azureService: AzureBlobService,
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Create new story',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
    ],
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('images'))
  @Post()
  async create(
    @Param('id') museumId: number,
    @Body() createStoryDto: CreateStoryDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
  ): Promise<Stories> {
    const promiseImage = files.map(async (image) => {
      const imageName = await this.azureService.uploadFile(image, 'Story');
      return this.azureService.getBlobUrl(imageName);
    });
    const images = await Promise.all(promiseImage);
    createStoryDto.image = images[0];
    createStoryDto.museumId = museumId;
    return await this.storiesService.create(createStoryDto);
  }

  @ApiOperation({
    summary: 'Get all stories',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
    ],
  })
  @Get()
  async findAll(
    @Param() id: number,
    @Query() pagination: Pagination
  ): Promise<Stories[]> {
    return this.storiesService.findAll(id, pagination);
  }

  @ApiOperation({
    summary: 'Get story by id',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
      {
        name: 'storyId',
        in: 'path',
        description: 'Story id',
        required: true,
        schema: { type: 'number' },
      }
    ],
  })
  @Get(':storyId')
  async findOne(
    @Param('id') museumId: number,
    @Param('storyId') id: number,
  ): Promise<Stories> {
    return this.storiesService.findOne(id, museumId);
  }

  @ApiOperation({
    summary: 'Update story',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
      {
        name: 'storyId',
        in: 'path',
        description: 'Story id',
        required: true,
        schema: { type: 'number' },
      }
    ],
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('images'))
  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @Patch(':storyId')
  async update(
    @Param('id') museumId: number,
    @Param('storyId') id: number,
    @Body() updateStoryDto: UpdateStoryDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
  ): Promise<Stories> {
    const promiseImage = files.map(async (image) => {
      const imageName = await this.azureService.uploadFile(image, 'Story');
      return this.azureService.getBlobUrl(imageName);
    });
    const images = await Promise.all(promiseImage);
    updateStoryDto.image = images[0];
    return this.storiesService.update(id, museumId, updateStoryDto);
  }

  @ApiOperation({
    summary: 'Delete story',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
      {
        name: 'storyId',
        in: 'path',
        description: 'Story id',
        required: true,
        schema: { type: 'number' },
      }
    ],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @Delete(':storyId')
  remove(
    @Param('id') museumId: number,
    @Param('storyId') id: number,
  ): Promise<Stories> {
    return this.storiesService.remove(id, museumId);
  }
}
