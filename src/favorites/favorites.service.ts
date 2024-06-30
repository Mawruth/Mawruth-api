import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaError } from 'src/utils/prisma-error.util';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMuseum(userId: number) {
    try {
      return await this.prisma.museumsFavorites.findMany({
        where: {
          userId,
        },
        include: {
          museum: {
            include: {
              images: {
                select: {
                  image_path: true,
                },
              },
              categories: {
                select: {
                  category: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async addMuseum(userId: number, museumId: number) {
    try {
      const isFav = await this.prisma.museumsFavorites.findFirst({
        where: {
          userId,
          museumId,
        },
      });

      if (isFav) {
        throw new BadRequestException(
          'user already added this museum to favorites list',
        );
      }

      return await this.prisma.museumsFavorites.create({
        data: {
          userId,
          museumId,
        },
        include: {
          museum: {
            include: {
              images: {
                select: {
                  image_path: true,
                },
              },
              categories: {
                select: {
                  category: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async deleteMuseum(userId: number, museumId: number) {
    try {
      const isFav = await this.prisma.museumsFavorites.findMany({
        where: {
          userId,
          museumId,
        },
      });

      if (!isFav.length) {
        throw new NotFoundException('This museum not added in favorites list');
      }

      await this.prisma.museumsFavorites.deleteMany({
        where: {
          userId,
          museumId,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getPiece(userId: number) {
    try {
      return await this.prisma.piecesFavorites.findMany({
        where: {
          userId,
        },
        include: {
          piece: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async addPiece(userId: number, pieceId: number) {
    try {
      const isFav = await this.prisma.piecesFavorites.findFirst({
        where: {
          userId,
          pieceId,
        },
      });

      if (isFav) {
        throw new BadRequestException(
          'user already added this piece to favorites list',
        );
      }

      return await this.prisma.piecesFavorites.create({
        data: {
          userId,
          pieceId,
        },
        include: {
          piece: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async deletePiece(userId: number, pieceId: number) {
    try {
      const isFav = await this.prisma.piecesFavorites.findMany({
        where: {
          userId,
          pieceId,
        },
      });

      if (!isFav.length) {
        throw new NotFoundException('This piece not added in favorites list');
      }

      await this.prisma.piecesFavorites.deleteMany({
        where: {
          userId,
          pieceId,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
