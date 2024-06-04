import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';
import { PaginationDto } from './dto/pagination.dto';
import { S3Service } from 'src/services/s3.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypeGuard } from 'src/guards/user-type.guard';
import { UserTypes } from 'src/decorators/userTypes.decorato';
import { CategoryIdDto } from './dto/category-id.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Create new category',
  })
  @ApiBearerAuth()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category =
      await this.categoriesService.createCategory(createCategoryDto);
    return category;
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
  })
  async getAllCategories(@Query() query: PaginationDto) {
    const categories = await this.categoriesService.getAllCategories(query);
    return categories;
  }

  @Delete(':id')
  @UseGuards(AuthGuard, UserTypeGuard)
  @ApiBearerAuth()
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Delete category by id',
  })
  async deleteCategory(@Param() categoryId: CategoryIdDto) {
    await this.categoriesService.deleteCategory(categoryId.id);
    return {
      message: 'Category deleted successfully',
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Update category by id',
  })
  @ApiBearerAuth()
  async updateCategory(
    @Body() categoryDto: CreateCategoryDto,
    @Param() categoryId: CategoryIdDto,
  ) {
    return await this.categoriesService.updateCategory(
      categoryId.id,
      categoryDto,
    );
  }
}
