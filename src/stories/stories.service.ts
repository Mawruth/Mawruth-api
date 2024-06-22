import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Stories } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaError } from 'src/utils/prisma-error.util';
import { Pagination } from 'src/shared/dto/pagination';
import { PaginationUtils } from 'src/utils/pagination.utils';

@Injectable()
export class StoriesService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createStoryDto: CreateStoryDto): Promise<Stories> {
    try {
      const res = await this.prismaService.stories.create({
        data: {
          name: createStoryDto.name,
          content: createStoryDto.content,
          museumId: createStoryDto.museumId,
          image: createStoryDto.image,
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
  ): Promise<Stories[]> {
    let res: Promise<Stories[]>;
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
  ): Promise<Stories> {
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
    updateStoryDto: UpdateStoryDto
  ): Promise<Stories> {
    try {
      const res = await this.prismaService.stories.update({
        where: {
          id: id,
          museumId: museumId,
        },
        data: {
          name: updateStoryDto.name,
          content: updateStoryDto.content,
          image: updateStoryDto.image,
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
  ): Promise<Stories> {
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
