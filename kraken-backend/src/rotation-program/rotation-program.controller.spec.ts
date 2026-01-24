import { Test, TestingModule } from '@nestjs/testing';
import { RotationProgramController } from './rotation-program.controller';

describe('RotationProgramController', () => {
  let controller: RotationProgramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RotationProgramController],
    }).compile();

    controller = module.get<RotationProgramController>(RotationProgramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
