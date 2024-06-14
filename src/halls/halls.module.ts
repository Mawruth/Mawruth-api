import { Module } from '@nestjs/common';
import { HallsService } from './halls.service';
import { HallsController } from './halls.controller';
import { AzureBlobService } from 'src/services/azure-blob.service';

@Module({
  controllers: [HallsController],
  providers: [HallsService, AzureBlobService],
})
export class HallsModule {}
