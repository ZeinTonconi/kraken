import { Test, TestingModule } from '@nestjs/testing';
import { RotationProgramService } from './rotation-program.service';

describe('RotationProgramService', () => {
  let service: RotationProgramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RotationProgramService],
    }).compile();

    service = module.get<RotationProgramService>(RotationProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
