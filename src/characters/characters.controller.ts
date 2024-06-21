import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFiles, ParseFilePipe, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypeGuard } from 'src/guards/user-type.guard';
import { UserTypes } from 'src/decorators/userTypes.decorator';
import { Characters } from '@prisma/client';
import { Pagination } from 'src/shared/dto/pagination';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureBlobService } from 'src/services/azure-blob.service';
import { CharactersService } from './character.service';

@ApiTags('characters')
@Controller('museums/:id/characters')
export class CharactersController {
  constructor(
    private readonly charactersService: CharactersService,
    private readonly azureService: AzureBlobService,
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Create new character',
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
    @Body() createCharacterDto: CreateCharacterDto,
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
  ): Promise<Characters> {
    const promiseImage = files.map(async (image) => {
      const imageName = await this.azureService.uploadFile(image, 'Character');
      return this.azureService.getBlobUrl(imageName);
    });
    const images = await Promise.all(promiseImage);
    createCharacterDto.image = images[0];
    createCharacterDto.museumId = museumId;
    return await this.charactersService.create(createCharacterDto);
  }

  @ApiOperation({
    summary: 'Get all characters',
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
  ): Promise<Characters[]> {
    return this.charactersService.findAll(id, pagination);
  }

  @ApiOperation({
    summary: 'Get character by id',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
      {
        name: 'characterId',
        in: 'path',
        description: 'Character id',
        required: true,
        schema: { type: 'number' },
      }
    ],
  })
  @Get(':characterId')
  async findOne(
    @Param('id') museumId: number,
    @Param('characterId') id: number,
  ): Promise<Characters> {
    return this.charactersService.findOne(id, museumId);
  }

  @ApiOperation({
    summary: 'Update character',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
      {
        name: 'characterId',
        in: 'path',
        description: 'Character id',
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
  @Patch(':characterId')
  async update(
    @Param('id') museumId: number,
    @Param('characterId') id: number,
    @Body() updateCharacterDto: UpdateCharacterDto,
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
  ): Promise<Characters> {
    const promiseImage = files.map(async (image) => {
      const imageName = await this.azureService.uploadFile(image, 'Character');
      return this.azureService.getBlobUrl(imageName);
    });
    const images = await Promise.all(promiseImage);
    updateCharacterDto.image = images[0];
    return this.charactersService.update(id, museumId, updateCharacterDto);
  }

  @ApiOperation({
    summary: 'Delete character',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Museum id',
        required: true,
        schema: { type: 'number' },
      },
      {
        name: 'characterId',
        in: 'path',
        description: 'Character id',
        required: true,
        schema: { type: 'number' },
      }
    ],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @Delete(':characterId')
  remove(
    @Param('id') museumId: number,
    @Param('characterId') id: number,
  ): Promise<Characters> {
    return this.charactersService.remove(id, museumId);
  }
}
