import { Test, TestingModule } from '@nestjs/testing';
import { MuseumReviewsController } from './museum-reviews.controller';
import { MuseumReviewsService } from './museum-reviews.service';

describe('MuseumReviewsController', () => {
  let controller: MuseumReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MuseumReviewsController],
      providers: [MuseumReviewsService],
    }).compile();

    controller = module.get<MuseumReviewsController>(MuseumReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
