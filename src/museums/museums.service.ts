import { Injectable, NotFoundException } from '@nestjs/common';
import { Museums, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMuseumDto } from './dto/update-museum.dto';
import { handlePrismaError } from 'src/utils/prisma-error.util';
import { CreateMuseumDto } from './dto/create-museum.dto';
import { FindMuseumQueryDto } from './dto/find-museum-query.dto';
import { UploadMuseumImagesDto } from './dto/upload-images.dto';

@Injectable()
export class MuseumsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllMuseums(query: FindMuseumQueryDto) {
    try {
      const page = query.page || 1;
      const limit = query.limit || 50;
      const skip = (page - 1) * limit;

      const where: Prisma.MuseumsWhereInput = {};
      if (query.name || query.city) {
        where.OR = [
          {
            name: { contains: query.name, mode: 'insensitive' },
          },
          {
            city: { contains: query.city, mode: 'insensitive' },
          },
        ];
      }
      const museums = await this.prismaService.museums.findMany({
        skip,
        take: limit,
        where,
        include: {
          images: {
            select: {
              image_path: true,
            },
          },
          categories: {
            select: {
              categoryId: true,
              category: true,
            },
          },
        },
      });

      return museums;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getMuseumById(id: number): Promise<Museums> {
    try {
      const res = await this.prismaService.museums.findUnique({
        where: {
          id: id,
        },
        include: {
          images: {
            select: {
              image_path: true,
            },
          },
          categories: {
            select: {
              categoryId: true,
              category: true,
            },
          },
        },
      });

      return res;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async createMuseum(museum: CreateMuseumDto): Promise<Museums> {
    let res: Promise<Museums>;
    try {
      res = this.prismaService.museums.create({
        data: museum,
      });
    } catch (error) {
      handlePrismaError(error);
    }
    return res;
  }

  async uploadMuseumImages(museumImages: UploadMuseumImagesDto) {
    const museum = await this.prismaService.museums.findUnique({
      where: {
        id: museumImages.museumId,
      },
    });

    if (!museum) {
      throw new NotFoundException('this museum not found');
    }

    interface ImageData {
      museum_id: number;
      image_path: string;
    }

    const data = museumImages.images.map((image) => {
      const imageData: ImageData = {
        museum_id: museumImages.museumId,
        image_path: image,
      };
      return imageData;
    });

    await this.prismaService.museumsImages.createMany({
      data,
    });
  }

  async editMuseum(id: number, data: UpdateMuseumDto): Promise<Museums> {
    let res: Promise<Museums>;
    try {
      res = this.prismaService.museums.update({
        where: {
          id: id,
        },
        data: {
          name: data.name,
          description: data.description,
          city: data.city,
          street: data.street,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
    return res;
  }

  async deleteMuseum(id: number): Promise<Museums> {
    let res: Promise<Museums>;
    try {
      res = this.prismaService.museums.delete({
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
