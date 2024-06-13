import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { AzureBlobService } from 'src/services/azure-blob.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, AzureBlobService],
})
export class CategoriesModule {}
