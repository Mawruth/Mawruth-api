import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection, Prisma } from '@prisma/client';
import { handlePrismaError } from 'src/utils/prisma-error.util';
import {
  UpdateCollectionNameDto,
  UpdateCollectionImageDto,
} from './dto/update-collection.dto';
import { Pagination } from 'src/shared/dto/pagination';
import { PaginationUtils } from 'src/utils/pagination.utils';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCollectionDto): Promise<Collection> {
    try {
      const res = await this.prisma.collection.create({
        data: {
          name: data.name,
          museumId: data.museumId,
          image: data.image,
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
  ): Promise<Collection[]> {
    const page = PaginationUtils.pagination(pagination.page, pagination.limit);

    try {
      const res = await this.prisma.collection.findMany({
        skip: page.skip,
        take: page.take,
        where: {
          museumId: museumId,
        },
      });
      return res.length > 0 ? res : null;
    } catch (err) {
      handlePrismaError(err);
    }
  }

  async findById(collection_id: number, museumId: number) {
    try {
      console.log(museumId);
      console.log(collection_id);

      const res = await this.prisma.collection.findMany({
        where: {
          id: collection_id,
          museumId: museumId,
        },
        select: {
          Pieces: true,
        },
      });

      const collection = res.map((item) => ({
        ...item,
        Pieces: item.Pieces.length > 0 ? item.Pieces : null,
      }));

      return collection;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(museumId: number, id: number): Promise<Collection> {
    try {
      let res = await this.prisma.collection.delete({
        where: {
          museumId: museumId,
          id: id,
        },
      });
      return res;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updateCollectionName(
    museumId: number,
    id: number,
    name: UpdateCollectionNameDto,
  ): Promise<Collection> {
    try {
      const res = await this.prisma.collection.update({
        where: {
          museumId: museumId,
          id: id,
        },
        data: name,
      });
      return res;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updateCollectionImage(
    museumId: number,
    id: number,
    image: UpdateCollectionImageDto,
  ): Promise<Collection> {
    try {
      const res = await this.prisma.collection.update({
        where: {
          museumId: museumId,
          id: id,
        },
        data: image,
      });
      return res;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
