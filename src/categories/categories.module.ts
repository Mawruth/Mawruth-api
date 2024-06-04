import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { S3Service } from 'src/services/s3.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, S3Service],
})
export class CategoriesModule {}
