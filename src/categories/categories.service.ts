import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma } from '@prisma/client';
import { handlePrismaError } from 'src/utils/prisma-error.util';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateAdvertisementDto } from 'src/advertisements/dto/update-advertisement.dto';
import { UpdateCategoryImageDto, UpdateCategoryNameDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(categoryDto: CreateCategoryDto) {
    try {
      const { name, image } = categoryDto;
      const newCategory: Prisma.CategoriesCreateInput = {
        name,
        image,
      };
      const createdCategory = await this.prisma.categories.create({
        data: newCategory,
      });
      return createdCategory;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getAllCategories(query: PaginationDto) {
    try {
      const page = query.page || 1;
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;
      const categories = await this.prisma.categories.findMany({
        skip,
        take: limit,
        orderBy: {
          name: 'asc',
        },
      });
      return categories;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async deleteCategory(categoryId: number) {
    try {
      await this.prisma.categories.delete({
        where: {
          id: categoryId,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updateCategoryName(categoryId: number, categoryDto: UpdateCategoryNameDto) {
    try {
      await this.prisma.categories.update({
        where: {
          id: categoryId,
        },
        data: categoryDto,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updateCategoryImage(categoryId: number, categoryDto: UpdateCategoryImageDto) {
    try {
      await this.prisma.categories.update({
        where: {
          id: categoryId,
        },
        data: categoryDto,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
