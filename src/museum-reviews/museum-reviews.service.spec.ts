import { Test, TestingModule } from '@nestjs/testing';
import { MuseumReviewsService } from './museum-reviews.service';

describe('MuseumReviewsService', () => {
  let service: MuseumReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MuseumReviewsService],
    }).compile();

    service = module.get<MuseumReviewsService>(MuseumReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
