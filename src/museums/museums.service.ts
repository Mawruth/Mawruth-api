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
      const user_id = query.user_id;

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
      const res = await this.prismaService.museums.findMany({
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
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      let museumsFav: number[] = [];

      if (user_id) {
        const favRes = await this.prismaService.museumsFavorites.findMany({
          where: {
            userId: user_id,
          },
        });

        museumsFav = favRes.map((item) => item.museumId);
      }
      
      const museums = res.map((item) => ({
        ...item,
        images: item.images.length > 0 ? item.images : null,
        categories: item.categories.length > 0 ? item.categories : null,
        isFavorite: museumsFav.includes(item.id) ? true : false,
      }));

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
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      const museum = {
        ...res,
        images: res.images.length > 0 ? res.images : null,
        categories: res.categories.length > 0 ? res.categories : null,
      };

      return museum;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async createMuseum(museum: CreateMuseumDto): Promise<Museums> {
    try {
      interface CategoryId {
        categoryId: number;
        museumId: number;
      }

      const res = await this.prismaService.museums.create({
        data: {
          name: museum.name,
          description: museum.description,
          city: museum.city,
          street: museum.street,
        },
      });

      const categoriesId = museum.categories.map((id) => {
        const categories: CategoryId = {
          categoryId: id,
          museumId: res.id,
        };
        return categories;
      });

      await this.prismaService.museumsCategories.createMany({
        data: categoriesId,
      });

      return res;
    } catch (error) {
      handlePrismaError(error);
    }
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

  async deleteMuseumImages(museumId: number, imageUrls: string[]): Promise<void> {
    const imagesToDelete = await this.prismaService.museumsImages.findMany({
      where: {
        museum_id: museumId,
        image_path: {
          in: imageUrls,
        },
      },
    });
  
    await this.prismaService.museumsImages.deleteMany({
      where: {
        id: {
          in: imagesToDelete.map((image) => image.id),
        },
      },
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
      await this.prismaService.museumsCategories.deleteMany({
        where: { museumId: id },
      });

      interface CategoryId {
        categoryId: number;
        museumId: number;
      }

      const newAssociations = data.categories.map((catID) => {
        {
          const categories: CategoryId = {
            categoryId: catID,
            museumId: id,
          };
          return categories;
      }});

      await this.prismaService.museumsCategories.createMany({
        data: newAssociations,
      });

    } catch (error) {
      handlePrismaError(error);
    }
    return res;
  }

  async deleteMuseum(id: number) {
    try {
      await this.prismaService.museumsCategories.deleteMany({
        where: { museumId: id },
      });

      await this.prismaService.museums.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
