import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HallsService } from './halls.service';
import { AzureBlobService } from 'src/services/azure-blob.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MuseumIdDto } from 'src/museums/dto/museum-id.dto';
import { FindHallsDto } from './dto/find-halls.dto';
import { HallIdDto } from './dto/hall-id.dto';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypeGuard } from 'src/guards/user-type.guard';
import { UserTypes } from 'src/decorators/userTypes.decorator';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('halls')
@Controller('halls')
export class HallsController {
  constructor(
    private readonly hallsService: HallsService,
    private readonly azureService: AzureBlobService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN', 'MUSEUMS_ADMIN')
  @ApiConsumes('multipart/form-data')
  async createHall(
    @Body() hallDto: CreateHallDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    const imageName = await this.azureService.uploadFile(file, 'Hall');
    hallDto.image = this.azureService.getBlobUrl(imageName);
    return await this.hallsService.createHall(hallDto);
  }

  @Get('museums/:id')
  async getMuseumHalls(
    @Param() museumId: MuseumIdDto,
    @Query() query: FindHallsDto,
  ) {
    return await this.hallsService.getMuseumHalls(query, museumId.id);
  }

  @Get(':id')
  async getHall(@Param() hallId: HallIdDto) {
    return await this.hallsService.getHall(hallId.id);
  }

  @Put('sound/:id')
  @UseInterceptors(FileInterceptor('audio'))
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN', 'MUSEUMS_ADMIN')
  async uploadSound(
    @UploadedFile() file: Express.Multer.File,
    @Param() hallId: HallIdDto,
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    const streamFile = new StreamableFile(file.buffer);
    const audioUrl = await this.azureService.uploadStream(
      streamFile,
      'Hall-Audio',
    );

    await this.hallsService.uploadHallAudio(audioUrl, hallId.id);
    return {
      audioUrl,
    };
  }

  @Get(':id/play-audio')
  async playAudio(
    @Param() hallId: HallIdDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const hall = await this.hallsService.getHall(hallId.id);
    if (!hall?.soundPath) {
      throw new BadRequestException('this hall not has audio');
    }

    try {
      const blobClient = await this.azureService.getBlobClient(hall?.soundPath);
      const blobProperties = await blobClient.getProperties();
      const audioSize = blobProperties.contentLength;

      const range = req.headers.range;
      if (range) {
        // parse range
        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ''));
        const end = Math.min(start + CHUNK_SIZE, audioSize - 1);
        const contentLength = end - start + 1;
        const headers = {
          'Content-Range': `bytes ${start}-${end}/${audioSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': contentLength,
          'Content-Type': 'audio/mpeg',
        };
        res.writeHead(206, headers);

        const downloadResponse = await blobClient.download(
          start,
          contentLength,
        );
        downloadResponse.readableStreamBody.pipe(res);
      } else {
        const head = {
          'Content-Length': audioSize,
          'Content-Type': 'audio/mpeg',
        };
        res.writeHead(200, head);

        const downloadResponse = await blobClient.download(0);
        downloadResponse.readableStreamBody.pipe(res);
      }
    } catch (error) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN', 'MUSEUMS_ADMIN')
  async deleteHall(@Param() hallId: HallIdDto) {
    await this.hallsService.deleteHall(hallId.id);
    return {
      message: 'hall deleted successfully',
    };
  }
}