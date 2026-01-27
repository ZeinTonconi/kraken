import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfile } from './dto/update-profile.dto';
import { Prisma, UserStatus } from '@prisma/client';
import { ChangeStatus } from './dto/change-stauts.dto';

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

  async changeStatus(userId: string, status: UserStatus) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('Invalid user');
    if(user.status === status)
      throw new BadRequestException(`The user has already the ${status} status`)

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        status
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
    try {
      return await this.prisma.profile.update({
        where: { userId },
        data: {
          ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
          ...(data.handle !== undefined ? { handle: data.handle } : {}),
          ...(data.avatarUrl !== undefined
            ? { avatarUrl: data.avatarUrl }
            : {}),
        },
        select: { fullName: true, handle: true, avatarUrl: true, role: true },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException('Invalid user');
      }

      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new BadRequestException('Handle already taken');
      }
      throw e;
    }
  }
}
