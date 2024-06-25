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
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { PiecesService } from './pieces.service';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypeGuard } from 'src/guards/user-type.guard';
import { UserTypes } from 'src/decorators/userTypes.decorator';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FindPieceDto } from './dto/find-piece.dto';
import { MuseumIdDto } from 'src/museums/dto/museum-id.dto';
import { PieceIdDto } from './dto/piece-id.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureBlobService } from 'src/services/azure-blob.service';
import { handleMuseumPermissionError } from 'src/utils/museum-permission-error';

@ApiTags('pieces')
@Controller('pieces')
export class PiecesController {
  constructor(
    private readonly pieces: PiecesService,
    private readonly azureService: AzureBlobService,
  ) {}

  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('MUSEUMS_ADMIN')
  @ApiOperation({
    summary: 'Create new piece',
  })
  @ApiBearerAuth()
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createPieceDto: CreatePieceDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Request() req,
  ) {
    handleMuseumPermissionError(createPieceDto.museumId, req.user.museum);
    const imageName = await this.azureService.uploadFile(file, 'Piece');
    const imageUrl = this.azureService.getBlobUrl(imageName);
    createPieceDto.image = imageUrl;
    return await this.pieces.createPiece(createPieceDto);
  }

  @ApiOperation({
    summary: 'Get all pieces',
  })
  @Get('museum/:id')
  async getAllPieces(
    @Query() query: FindPieceDto,
    @Param() museumId: MuseumIdDto,
  ) {
    return await this.pieces.getAllPieces(query, museumId.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get piece by id',
  })
  @ApiBearerAuth()
  async getById(@Param() pieceId: PieceIdDto) {
    return this.pieces.getPieceById(pieceId.id);
  }

  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('MUSEUMS_ADMIN')
  @Patch(':id')
  @ApiOperation({
    summary: 'Edit piece by id',
  })
  @ApiBearerAuth()
  async editPiece(
    @Param() pieceId: PieceIdDto,
    @Body() editPieceDto: UpdatePieceDto,
  ) {
    return this.pieces.editPiece(pieceId.id, editPieceDto);
  }

  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('MUSEUMS_ADMIN')
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete piece by id',
  })
  @ApiBearerAuth()
  async deletePiece(@Param() pieceId: PieceIdDto) {
    await this.pieces.deletePiece(pieceId.id);
    return {
      message: 'piece deleted successfully',
    };
  }
}
