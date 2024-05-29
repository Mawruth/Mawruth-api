import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';
import { Response } from 'express';
import { HttpStatusText } from 'src/utils/http-status.utils';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    const category =
      await this.categoriesService.createCategory(createCategoryDto);
    res.status(201).json({
      status: HttpStatusText.SUCCESS,
      data: {
        category,
      },
    });
  }

  @Get()
  async getAllCategories(@Res() res: Response) {
    const categories = await this.categoriesService.getAllCategories();
    res.status(HttpStatus.OK).json({
      status: HttpStatusText.SUCCESS,
      data: {
        categories,
      },
    });
  }
}
