import { Injectable } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Characters } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaError } from 'src/utils/prisma-error.util';
import { Pagination } from 'src/shared/dto/pagination';
import { PaginationUtils } from 'src/utils/pagination.utils';

@Injectable()
export class CharactersService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createCharacterDto: CreateCharacterDto): Promise<Characters> {
    try {
      const res = await this.prismaService.stories.create({
        data: {
          name: createCharacterDto.name,
          content: createCharacterDto.content,
          museumId: createCharacterDto.museumId,
          image: createCharacterDto.image,
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
  ): Promise<Characters[]> {
    let res: Promise<Characters[]>;
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
  ): Promise<Characters> {
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
    updateCharacterDto: UpdateCharacterDto
  ): Promise<Characters> {
    try {
      const res = await this.prismaService.stories.update({
        where: {
          id: id,
          museumId: museumId,
        },
        data: {
          name: updateCharacterDto.name,
          content: updateCharacterDto.content,
          image: updateCharacterDto.image,
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
  ): Promise<Characters> {
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
