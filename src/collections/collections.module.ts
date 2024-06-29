import { Module } from '@nestjs/common';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { AzureBlobService } from 'src/services/azure-blob.service';

@Module({
  controllers: [CollectionsController],
  providers: [CollectionsService, AzureBlobService],
})
export class CollectionsModule { }
