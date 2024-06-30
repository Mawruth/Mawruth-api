import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { MuseumIdDto } from 'src/museums/dto/museum-id.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserTypeGuard } from 'src/guards/user-type.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypes } from 'src/decorators/userTypes.decorator';
import { PieceIdDto } from 'src/pieces/dto/piece-id.dto';

@Controller('favorites')
@ApiTags('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('museums')
  @ApiOperation({
    summary: 'Get museum favorites list',
  })
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('USER')
  @ApiBearerAuth()
  async getMuseum(@Request() req) {
    const userId = req.user.id;
    return await this.favoritesService.getMuseum(userId);
  }

  @Post('museums/:id')
  @ApiOperation({
    summary: 'Add museum to favorites list',
  })
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('USER')
  @ApiBearerAuth()
  async addMuseum(@Param() museumId: MuseumIdDto, @Request() req) {
    const userId = req.user.id;
    return await this.favoritesService.addMuseum(userId, museumId.id);
  }

  @Delete('museums/:id')
  @ApiOperation({
    summary: 'Delete museum from favorites list',
  })
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('USER')
  @ApiBearerAuth()
  async deleteMuseum(@Param() museumId: MuseumIdDto, @Request() req) {
    const userId = req.user.id;
    await this.favoritesService.deleteMuseum(userId, museumId.id);
    return {
      message: 'museum deleted from favorite list successfully ',
    };
  }

  @Get('pieces')
  @ApiOperation({
    summary: 'Get piece favorites list',
  })
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('USER')
  @ApiBearerAuth()
  async getPiece(@Request() req) {
    const userId = req.user.id;
    return await this.favoritesService.getPiece(userId);
  }

  @Post('pieces/:id')
  @ApiOperation({
    summary: 'Add piece to favorites list',
  })
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('USER')
  @ApiBearerAuth()
  async addPiece(@Param() pieceId: PieceIdDto, @Request() req) {
    const userId = req.user.id;
    return await this.favoritesService.addPiece(userId, pieceId.id);
  }

  @Delete('pieces/:id')
  @ApiOperation({
    summary: 'Delete piece from favorites list',
  })
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('USER')
  @ApiBearerAuth()
  async deletePiece(@Param() pieceId: PieceIdDto, @Request() req) {
    const userId = req.user.id;
    await this.favoritesService.deletePiece(userId, pieceId.id);
    return {
      message: 'piece deleted from favorite list successfully ',
    };
  }
}
