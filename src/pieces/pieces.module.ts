import { Module } from '@nestjs/common';
import { PiecesService } from './pieces.service';
import { PiecesController } from './pieces.controller';
import { AzureBlobService } from 'src/services/azure-blob.service';

@Module({
  controllers: [PiecesController],
  providers: [PiecesService, AzureBlobService],
})
export class PiecesModule {}
