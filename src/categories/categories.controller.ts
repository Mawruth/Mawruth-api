import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';
import { PaginationDto } from './dto/pagination.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypeGuard } from 'src/guards/user-type.guard';
import { UserTypes } from 'src/decorators/userTypes.decorator';
import { CategoryIdDto } from './dto/category-id.dto';
import { AzureBlobService } from 'src/services/azure-blob.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateCategoryImageDto, UpdateCategoryNameDto } from './dto/update-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly azureService: AzureBlobService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, UserTypeGuard)
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Create new category',
  })
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    const imageName = await this.azureService.uploadFile(file, 'Category');
    const imageUrl = this.azureService.getBlobUrl(imageName);
    createCategoryDto.image = imageUrl;
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

  @Put('update-name/:id')
  @UseGuards(AuthGuard, UserTypeGuard)
  @ApiBearerAuth()
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Update category name by id',
  })
  @ApiBearerAuth()
  async updateCategoryName(
    @Body() categoryDto: UpdateCategoryNameDto,
    @Param() categoryId: CategoryIdDto,
  ) {
    await this.categoriesService.updateCategoryName(
      categoryId.id,
      categoryDto,
    );
    return {
      "name":categoryDto.name
    }
  }

  @Put('update-image/:id')
  @UseGuards(AuthGuard, UserTypeGuard)
  @ApiBearerAuth()
  @UserTypes('SUPPER_ADMIN')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Update category image by id',
  })
  async updateCategoryImage(
    @Body() categoryDto: UpdateCategoryImageDto,
    @Param() categoryId: CategoryIdDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    const imageName = await this.azureService.uploadFile(file, 'Category');
    const imageUrl = this.azureService.getBlobUrl(imageName);
    categoryDto.image = imageUrl;
    await this.categoriesService.updateCategoryImage(
      categoryId.id,
      categoryDto,
    );
    return {
      "imageUrl": imageUrl
    } 
  }

  @Delete('remove-image/:id')
  @UseGuards(AuthGuard, UserTypeGuard)
  @ApiBearerAuth()
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Delete category image by id',
  })
  async deleteCategoryImage(@Param() categoryId: CategoryIdDto) {
    const categoryDto = new UpdateCategoryImageDto
    categoryDto.image = null
    await this.categoriesService.updateCategoryImage(categoryId.id,categoryDto);
    return {
      message: 'Category image deleted successfully',
    };
  }

}