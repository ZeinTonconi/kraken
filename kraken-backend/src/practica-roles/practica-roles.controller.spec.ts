import { Test, TestingModule } from '@nestjs/testing';
import { PracticaRolesController } from './practica-roles.controller';

describe('PracticaRolesController', () => {
  let controller: PracticaRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PracticaRolesController],
    }).compile();

    controller = module.get<PracticaRolesController>(PracticaRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
