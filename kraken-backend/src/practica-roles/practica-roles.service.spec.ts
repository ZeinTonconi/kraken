import { Test, TestingModule } from '@nestjs/testing';
import { PracticaRolesService } from './practica-roles.service';

describe('PracticaRolesService', () => {
  let service: PracticaRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PracticaRolesService],
    }).compile();

    service = module.get<PracticaRolesService>(PracticaRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
