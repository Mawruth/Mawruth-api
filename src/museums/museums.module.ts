import { Module } from '@nestjs/common';
import { MuseumsService } from './museums.service';
import { MuseumsController } from './museums.controller';

@Module({
  providers: [MuseumsService],
  controllers: [MuseumsController]
})
export class MuseumsModule {}
