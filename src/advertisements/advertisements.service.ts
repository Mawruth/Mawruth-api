import { Injectable } from '@nestjs/common';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { Advertisements } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaError } from 'src/utils/prisma-error.util';
import { Pagination } from 'src/shared/dto/pagination';
import { PaginationUtils } from 'src/utils/pagination.utils';

@Injectable()
export class AdvertisementsService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createAdvertisementDto: CreateAdvertisementDto): Promise<Advertisements> {
    try {
      const res = await this.prismaService.stories.create({
        data: {
          name: createAdvertisementDto.name,
          content: createAdvertisementDto.content,
          museumId: createAdvertisementDto.museumId,
          image: createAdvertisementDto.image,
        },
      });
      return res;
    } catch (err) {
      handlePrismaError(err);
    }
  }

  async findAll(
    museumId: number,
    pagination: Pagination
  ): Promise<Advertisements[]> {
    let res: Promise<Advertisements[]>;
    const page = PaginationUtils.pagination(pagination.page, pagination.limit);

    try {
      res = this.prismaService.stories.findMany({
        skip: page.skip,
        take: page.take,
        where: {
          museumId: museumId,
        },
      });
      return res;
    } catch (err) {
      handlePrismaError(err);
    }
  }

  async findOne(
    id: number,
    museumId: number,
  ): Promise<Advertisements> {
    try {
      const res = await this.prismaService.stories.findUnique({
        where: {
          id: id,
          museumId: museumId,
        },
      });
      return res;
    } catch (err) {
      handlePrismaError(err);
    }
  }

  async update(
    id: number,
    museumId: number,
    updateAdvertisementDto: UpdateAdvertisementDto
  ): Promise<Advertisements> {
    try {
      const res = await this.prismaService.stories.update({
        where: {
          id: id,
          museumId: museumId,
        },
        data: {
          name: updateAdvertisementDto.name,
          content: updateAdvertisementDto.content,
          image: updateAdvertisementDto.image,
        },
      });
      return res;
    } catch (err) {
      handlePrismaError(err);
    }
  }

  async remove(
    id: number,
    museumId: number
  ): Promise<Advertisements> {
    try {
      const res = await this.prismaService.stories.delete({
        where: {
          id: id,
          museumId: museumId,
        },
      });
      return res;
    } catch (err) {
      handlePrismaError(err);
    }
  }
}
