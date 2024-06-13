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
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  UploadedFiles,
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
import { AzureBlobService } from 'src/services/azure-blob.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadMuseumImagesDto } from './dto/upload-images.dto';

@ApiTags('museums')
@Controller('museums')
export class MuseumsController {
  constructor(
    private readonly service: MuseumsService,
    private readonly azureService: AzureBlobService,
  ) {}

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

  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadImage(
    @Body() uploadImages: UploadMuseumImagesDto,
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
  ) {
    const promiseImage = files.map(async (image) => {
      const imageName = await this.azureService.uploadFile(image, 'Museum');
      return this.azureService.getBlobUrl(imageName);
    });

    const images = await Promise.all(promiseImage);

    uploadImages.images = images;
    await this.service.uploadMuseumImages(uploadImages);
    return {
      message: 'image added successfully',
    };
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
