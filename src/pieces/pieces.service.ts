import { Injectable } from '@nestjs/common';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Pieces } from '@prisma/client';
import { handlePrismaError } from 'src/utils/prisma-error.util';

@Injectable()
export class PiecesService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPiece(createPieceDto: CreatePieceDto): Promise<Pieces> {
    let res: Promise<Pieces>;
    try {
      res = this.prismaService.pieces.create({
        data: createPieceDto,
      });
    } catch (err) {
      handlePrismaError(err);
    }
    return res;
  }

  async getAllPieces(
    page: number,
    limit: number,
    search: string,
  ): Promise<Pieces[]> {
    let res: Promise<Pieces[]>;
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    let filter = {};
    try {
      if (search) {
        filter = {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        };
      }
      res = this.prismaService.pieces.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: filter,
        orderBy: {
          id: 'desc',
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
    return res;
  }

  async getPieceById(id: number): Promise<Pieces> {
    let res: Promise<Pieces>;
    try {
      res = this.prismaService.pieces.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
    return res;
  }

  async editPiece(id: number, data: UpdatePieceDto): Promise<Pieces> {
    let res: Promise<Pieces>;
    try {
      res = this.prismaService.pieces.update({
        where: {
          id: id,
        },
        data: {
          name: data.name,
          description: data.description,
          isMasterpiece: data.isMasterpiece,
          age: data.age,
          museumId: data.museumId,
          arPath: data.arPath,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
    return res;
  }

  async deletePiece(id: number): Promise<Pieces> {
    let res: Promise<Pieces>;
    try {
      res = this.prismaService.pieces.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
    return res;
  }
}
