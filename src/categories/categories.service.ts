import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma } from '@prisma/client';
import { handlePrismaError } from 'src/utils/prisma-error.util';

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

  async getAllCategories() {
    try {
      const categories = await this.prisma.categories.findMany();
      return categories;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
