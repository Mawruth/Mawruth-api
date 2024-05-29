import { Test, TestingModule } from '@nestjs/testing';
import { MuseumsController } from './museums.controller';

describe('MuseumsController', () => {
  let controller: MuseumsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MuseumsController],
    }).compile();

    controller = module.get<MuseumsController>(MuseumsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
