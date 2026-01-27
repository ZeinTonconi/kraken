import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserStatus } from '@prisma/client';

describe('ProfilesService - changeStatusStudent', () => {
  let service: ProfilesService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    profile: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = moduleRef.get(ProfilesService);
  });

  it('sets status to DISABLED when currently ACTIVE', async () => {
    const userId = 'u1';

    prismaMock.user.findUnique.mockResolvedValue({
      id: userId,
      status: UserStatus.ACTIVE,
    });

    prismaMock.user.update.mockResolvedValue({
      email: 'a@b.com',
      status: UserStatus.DISABLED,
      profile: { fullName: 'A', role: 'STUDENT' },
    });

    const out = await service.changeStatusStudent(userId, UserStatus.DISABLED);

    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: userId },
        data: { status: UserStatus.DISABLED },
      }),
    );
    expect(out.status).toBe(UserStatus.DISABLED);
  });

  it('throws NotFoundException when user does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(
      service.changeStatusStudent('missing', UserStatus.ACTIVE),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it('throws BadRequestException when status is already the same', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u1',
      status: UserStatus.ACTIVE,
    });

    await expect(
      service.changeStatusStudent('u1', UserStatus.ACTIVE),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });
});
