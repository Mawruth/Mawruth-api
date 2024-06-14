import { Injectable } from '@nestjs/common';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Pieces, Prisma } from '@prisma/client';
import { handlePrismaError } from 'src/utils/prisma-error.util';
import { FindPieceDto } from './dto/find-piece.dto';
import { PaginationUtils } from 'src/utils/pagination.utils';

@Injectable()
export class PiecesService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPiece(createPieceDto: CreatePieceDto): Promise<Pieces> {
    try {
      const res = await this.prismaService.pieces.create({
        data: {
          name: createPieceDto.name,
          description: createPieceDto.description,
          age: createPieceDto.age,
          hallId: createPieceDto.hallId,
          museumId: createPieceDto.museumId,
          arPath: createPieceDto.arPath,
          image: createPieceDto.image,
          isMasterpiece: createPieceDto.isMasterpiece,
        },
      });
      return res;
    } catch (err) {
      handlePrismaError(err);
    }
  }

  async getAllPieces(query: FindPieceDto, museumId: number): Promise<Pieces[]> {
    const pagination = PaginationUtils.pagination(query.page, query.limit);
    try {
      const where: Prisma.PiecesWhereInput = {};
      where.museumId = museumId;
      if (query.name) {
        where.OR = [
          {
            name: { contains: query.name, mode: 'insensitive' },
          },
        ];
      }
      const res = await this.prismaService.pieces.findMany({
        skip: pagination.skip,
        take: pagination.take,
        where,
        orderBy: {
          id: 'desc',
        },
      });
      return res;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getPieceById(id: number): Promise<Pieces> {
    try {
      const res = await this.prismaService.pieces.findUnique({
        where: {
          id: id,
        },
      });
      return res;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async editPiece(id: number, data: UpdatePieceDto): Promise<Pieces> {
    try {
      const res = await this.prismaService.pieces.update({
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
      return res;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async deletePiece(id: number) {
    try {
      await this.prismaService.pieces.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
