import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFiles, ParseFilePipe, ParseFilePipeBuilder, HttpStatus, UploadedFile } from '@nestjs/common';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypeGuard } from 'src/guards/user-type.guard';
import { UserTypes } from 'src/decorators/userTypes.decorator';
import { Advertisements } from '@prisma/client';
import { Pagination } from 'src/shared/dto/pagination';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureBlobService } from 'src/services/azure-blob.service';
import { AdvertisementsService } from './advertisements.service';

@ApiTags('advertisements')
@Controller('museums/:id/ads')
export class AdvertisementsController {
  constructor(
    private readonly advertisementsService: AdvertisementsService,
    private readonly azureService: AzureBlobService,
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Create new advertisement',
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
    @Body() createAdvertisementDto: CreateAdvertisementDto,
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
  ): Promise<Advertisements> {
    const imageName = await this.azureService.uploadFile(file, 'Advertisement');
    const imageUrl = this.azureService.getBlobUrl(imageName);
    createAdvertisementDto.image = imageUrl;

    createAdvertisementDto.museumId = +museumId;
    return await this.advertisementsService.create(createAdvertisementDto);
  }

  @ApiOperation({
    summary: 'Get all advertisements',
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
  ): Promise<Advertisements[]> {
    return this.advertisementsService.findAll(+id, pagination);
  }

  @ApiOperation({
    summary: 'Get advertisement by id',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
      {
        name: 'adId',
        in: 'path',
        description: 'Advertisement id',
        required: true,
        schema: { type: 'number' },
      }
    ],
  })
  @Get(':adId')
  async findOne(
    @Param('id') museumId: number,
    @Param('adId') id: number,
  ): Promise<Advertisements> {
    return this.advertisementsService.findOne(+id, +museumId);
  }

  @ApiOperation({
    summary: 'Update advertisement',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
      {
        name: 'adId',
        in: 'path',
        description: 'Advertisement id',
        required: true,
        schema: { type: 'number' },
      }
    ],
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @Patch(':adId')
  async update(
    @Param('id') museumId: number,
    @Param('adId') id: number,
    @Body() updateAdvertisementDto: UpdateAdvertisementDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(png|jpeg|jpg)/,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file?: Express.Multer.File,
  ): Promise<Advertisements> {
    if (file) {
      const imageName = await this.azureService.uploadFile(file, 'Advertisement');
      updateAdvertisementDto.image = this.azureService.getBlobUrl(imageName);
    }
    return this.advertisementsService.update(+id, +museumId, updateAdvertisementDto);
  }

  @ApiOperation({
    summary: 'Delete advertisement',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
      {
        name: 'adId',
        in: 'path',
        description: 'Advertisement id',
        required: true,
        schema: { type: 'number' },
      }
    ],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @Delete(':adId')
  remove(
    @Param('id') museumId: number,
    @Param('adId') id: number,
  ): Promise<Advertisements> {
    return this.advertisementsService.remove(+id, +museumId);
  }
}
