import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { handlePrismaError } from 'src/utils/prisma-error.util';
import { FindHallsDto } from './dto/find-halls.dto';
import { PaginationUtils } from 'src/utils/pagination.utils';

@Injectable()
export class HallsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createHall(hallDto: CreateHallDto) {
    try {
      return await this.prismaService.halls.create({
        data: {
          name: hallDto.name,
          description: hallDto.description,
          image_path: hallDto.image,
          museum_id: hallDto.museum_id,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getMuseumHalls(query: FindHallsDto, museum_id: number) {
    const pagination = PaginationUtils.pagination(query.page, query.limit);
    try {
      return await this.prismaService.halls.findMany({
        where: {
          museum_id,
        },
        take: pagination.take,
        skip: pagination.skip,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getHall(hallId: number) {
    try {
      return await this.prismaService.halls.findUnique({
        where: {
          id: hallId,
        },
        include: {
          museum: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async uploadHallAudio(audioPath: string, hallId: number) {
    try {
      await this.prismaService.halls.update({
        where: {
          id: hallId,
        },
        data: {
          soundPath: audioPath,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async deleteHall(hallId: number) {
    try {
      await this.prismaService.halls.delete({
        where: {
          id: hallId,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
