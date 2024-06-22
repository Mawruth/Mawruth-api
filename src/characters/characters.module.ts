import { Module } from '@nestjs/common';
import { CharactersService } from './character.service';
import { CharactersController } from './characters.controller';
import { AzureBlobService } from 'src/services/azure-blob.service';

@Module({
  controllers: [CharactersController],
  providers: [CharactersService,AzureBlobService],
})
export class CharactersModule { }
