import { Module } from '@nestjs/common';
import { MuseumsService } from './museums.service';
import { MuseumsController } from './museums.controller';
import { AzureBlobService } from 'src/services/azure-blob.service';

@Module({
  providers: [MuseumsService, AzureBlobService],
  controllers: [MuseumsController],
})
export class MuseumsModule {}
