import { Test } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { UserStatus } from '@prisma/client';

describe('ProfilesController - changeStatusStudent', () => {
  let controller: ProfilesController;

  const profilesServiceMock = {
    changeStatusStudent: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [{ provide: ProfilesService, useValue: profilesServiceMock }],
    }).compile();

    controller = moduleRef.get(ProfilesController);
  });

  it('calls service with id and dto.status', async () => {
    profilesServiceMock.changeStatusStudent.mockResolvedValue({ status: UserStatus.DISABLED });

    const out = await controller.changeStatusStudent('u1', { status: UserStatus.DISABLED } as any);

    expect(profilesServiceMock.changeStatusStudent).toHaveBeenCalledWith(
      'u1',
      UserStatus.DISABLED,
    );
    expect(out).toEqual({ status: UserStatus.DISABLED });
  });
});
