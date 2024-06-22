import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { AzureBlobService } from 'src/services/azure-blob.service';

@Module({
  controllers: [StoriesController],
  providers: [StoriesService, AzureBlobService],
})
export class StoriesModule { }
