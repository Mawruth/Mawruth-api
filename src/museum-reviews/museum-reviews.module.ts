import { Module } from '@nestjs/common';
import { MuseumReviewsService } from './museum-reviews.service';
import { MuseumReviewsController } from './museum-reviews.controller';

@Module({
  controllers: [MuseumReviewsController],
  providers: [MuseumReviewsService],
})
export class MuseumReviewsModule {}
