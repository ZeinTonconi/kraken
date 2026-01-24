import { Test, TestingModule } from '@nestjs/testing';
import { OfferingsController } from './offerings.controller';

describe('OfferingsController', () => {
  let controller: OfferingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferingsController],
    }).compile();

    controller = module.get<OfferingsController>(OfferingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
