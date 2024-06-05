import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { PiecesService } from './pieces.service';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypeGuard } from 'src/guards/user-type.guard';
import { UserTypes } from 'src/decorators/userTypes.decorato';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("pieces")
@Controller('pieces')
export class PiecesController {
  constructor(private readonly pieces: PiecesService) { }

  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes("SUPPER_ADMIN")
  @ApiOperation({
    summary: 'Create new piece',
  })
  @ApiBearerAuth()
  @Post()
  create(@Body() createPieceDto: CreatePieceDto) {
    return this.pieces.createPiece(createPieceDto);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get all pieces',
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
  @Get()
  async getAllPieces(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("search") search: string,
  ) {
    return this.pieces.getAllPieces(page, limit, search);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get piece by id',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Piece id',
        required: true,
        schema: { type: 'number' }
      },
    ]
  })
  @ApiBearerAuth()
  async getById(@Param('id') id: number) {
    return this.pieces.getPieceById(id);
  }

  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes("SUPPER_ADMIN")
  @Patch(':id')
  @ApiOperation({
    summary: 'Edit piece by id',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Piece id',
        required: true,
        schema: { type: 'number' }
      },
    ]
  })
  @ApiBearerAuth()
  async editPiece(
    @Param('id') id: number,
    @Body() editPieceDto: UpdatePieceDto,
  ) {
    return this.pieces.editPiece(id, editPieceDto);
  }

  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes("SUPPER_ADMIN")
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete piece by id',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Piece id',
        required: true,
        schema: { type: 'number' }
      },
    ]
  })
  @ApiBearerAuth()
  async deletePiece(@Param('id') id: number) {
    return this.pieces.deletePiece(id);
  }
}
