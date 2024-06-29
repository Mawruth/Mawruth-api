import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CollectionsService } from './collections.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypeGuard } from 'src/guards/user-type.guard';
import { UserTypes } from 'src/decorators/userTypes.decorator';
import { AzureBlobService } from 'src/services/azure-blob.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UpdateCollectionImageDto,
  UpdateCollectionNameDto,
} from './dto/update-collection.dto';
import { Collection } from '@prisma/client';
import { Pagination } from 'src/shared/dto/pagination';
import { MuseumIdDto } from 'src/museums/dto/museum-id.dto';

@ApiTags('collections')
@Controller('/museums/:id/collections')
export class CollectionsController {
  constructor(
    private readonly service: CollectionsService,
    private readonly azureService: AzureBlobService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Create new collection',
  })
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Param() museumId: MuseumIdDto,
    @Body() data: CreateCollectionDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(png|jpeg|jpg)/,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<Collection> {
    const imageName = await this.azureService.uploadFile(file, 'Collection');
    const imageUrl = this.azureService.getBlobUrl(imageName);
    data.image = imageUrl;
    data.museumId = museumId.id;
    const collection = await this.service.create(data);
    return collection;
  }

  @Get()
  @ApiOperation({
    summary: 'Get all collections',
    parameters: [
      {
        name: 'museumId',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
    ],
  })
  async findAll(
    @Param() museumId: MuseumIdDto,
    @Query() pagination: Pagination,
  ): Promise<Collection[]> {
    const collections = await this.service.findAll(museumId.id, pagination);
    return collections;
  }

  @Delete(':collection_id')
  @UseGuards(AuthGuard, UserTypeGuard)
  @ApiBearerAuth()
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Delete collection by id',
    parameters: [
      {
        name: 'museumId',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
      {
        name: 'collection_id',
        in: 'path',
        description: 'Collection id',
        required: true,
        schema: { type: 'number' },
      },
    ],
  })
  async delete(
    @Param() museumId: MuseumIdDto,
    @Param('collection_id') id: number,
  ): Promise<{ message: string }> {
    await this.service.delete(museumId.id, id);
    return {
      message: 'Collection deleted successfully',
    };
  }

  @Put('update-name/:collection_id')
  @UseGuards(AuthGuard, UserTypeGuard)
  @ApiBearerAuth()
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Update collection name by id',
    parameters: [
      {
        name: 'museumId',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
      {
        name: 'collection_id',
        in: 'path',
        description: 'Collection id',
        required: true,
        schema: { type: 'number' },
      },
    ],
  })
  @ApiBearerAuth()
  async updateCollectionName(
    @Body() name: UpdateCollectionNameDto,
    @Param() museumId: MuseumIdDto,
    @Param('collection_id') id: number,
  ): Promise<Collection> {
    const res = await this.service.updateCollectionName(museumId.id, id, name);
    return res;
  }

  @Put('update-image/:collection_id')
  @UseGuards(AuthGuard, UserTypeGuard)
  @ApiBearerAuth()
  @UserTypes('SUPPER_ADMIN')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Update collection image by id',
    parameters: [
      {
        name: 'museumId',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
      {
        name: 'collection_id',
        in: 'path',
        description: 'Collection id',
        required: true,
        schema: { type: 'number' },
      },
    ],
  })
  async updateCollectionImage(
    @Body() image: UpdateCollectionImageDto,
    @Param() museumId: MuseumIdDto,
    @Param('collection_id') id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(png|jpeg|jpg)/,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<Collection> {
    const imageName = await this.azureService.uploadFile(file, 'Collection');
    const imageUrl = this.azureService.getBlobUrl(imageName);
    image.image = imageUrl;
    const res = await this.service.updateCollectionImage(
      museumId.id,
      id,
      image,
    );
    return res;
  }
}
