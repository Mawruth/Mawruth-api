import { Module } from '@nestjs/common';
import { AdvertisementsService } from './advertisements.service';
import { AdvertisementsController } from './advertisements.controller';
import { AzureBlobService } from 'src/services/azure-blob.service';

@Module({
  controllers: [AdvertisementsController],
  providers: [AdvertisementsService, AzureBlobService],
})
export class AdvertisementsModule { }
