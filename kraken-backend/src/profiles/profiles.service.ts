import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfile } from './dto/update-profile.dto';
import { UserStatus } from '@prisma/client';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfileById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        status: true,
        profile: {
          select: {
            fullName: true,
            handle: true,
            avatarUrl: true,
            role: true,
          },
        },
        wallet: {
          select: {
            coinsBalance: true,
            diamondsBalance: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('Invalid user');
    return user;
  }

  async changeStatusStudnet(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('Invalid user');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        status:
          user?.status === UserStatus.ACTIVE
            ? UserStatus.DISABLED
            : UserStatus.ACTIVE,
      },
      select: {
        email: true,
        status: true,
        profile: {
          select: {
            fullName: true,
            role: true,
          },
        },
      },
    });
    return updated;
  }

  async updateMyProfile(userId: string, data: UpdateProfile) {
    const updated = await this.prisma.profile.update({
      where: { userId },
      data: {
        fullName: data.fullName,
        handle: data.handle,
        avatarUrl: data.avatarUrl,
      },
      select: {
        fullName: true,
        handle: true,
        avatarUrl: true,
        role: true,
      },
    });
    if (!updated) throw new NotFoundException('Invalid user');
    return updated;
  }
}
