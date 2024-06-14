import { Injectable } from '@nestjs/common';
import { CreateMuseumReviewDto } from './dto/create-museum-review.dto';
import { UpdateMuseumReviewDto } from './dto/update-museum-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaError } from 'src/utils/prisma-error.util';
import { MuseumReviews } from '@prisma/client';
import { Pagination } from 'src/shared/dto/pagination';
import { PaginationUtils } from 'src/utils/pagination.utils';

@Injectable()
export class MuseumReviewsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createMuseumReviewDto: CreateMuseumReviewDto,
  ): Promise<MuseumReviews> {
    try {
      const res = await this.prismaService.museumReviews.create({
        data: {
          museumId: createMuseumReviewDto.museumId,
          userId: createMuseumReviewDto.userId,
          content: createMuseumReviewDto.content,
          rating: createMuseumReviewDto.rating,
        },
      });
      return res;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findAll(
    museumId: number,
    pagination: Pagination,
  ): Promise<MuseumReviews[]> {
    let res: Promise<MuseumReviews[]>;
    const page = PaginationUtils.pagination(pagination.page, pagination.limit);

    try {
      res = this.prismaService.museumReviews.findMany({
        where: {
          museumId: museumId,
        },
        skip: page.skip,
        take: page.take,
        orderBy: {
          id: 'desc',
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
    return res;
  }

  async findOne(id: number, museumId: number): Promise<MuseumReviews> {
    let res: Promise<MuseumReviews>;
    try {
      res = this.prismaService.museumReviews.findUnique({
        where: {
          id: id,
          museumId: museumId,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
    return res;
  }

  async update(
    id: number,
    museumId: number,
    updateMuseumReviewDto: UpdateMuseumReviewDto,
  ): Promise<MuseumReviews> {
    let res: Promise<MuseumReviews>;

    try {
      res = this.prismaService.museumReviews.update({
        where: {
          id: id,
          museumId: museumId,
        },
        data: updateMuseumReviewDto,
      });
    } catch (error) {
      handlePrismaError(error);
    }
    return res;
  }

  async remove(id: number, museumId: number): Promise<MuseumReviews> {
    let res: Promise<MuseumReviews>;
    try {
      res = this.prismaService.museumReviews.delete({
        where: {
          id: id,
          museumId: museumId,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
    return res;
  }
}
