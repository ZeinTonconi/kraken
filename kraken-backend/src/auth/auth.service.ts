import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { GlobalRole } from '@prisma/client';

type JwtPair = { accessToken: string; refreshToken: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private accessSecret() {
    return process.env.JWT_ACCESS_SECRET!;
  }

  private refreshSecret() {
    return process.env.JWT_REFRESH_SECRET!;
  }

  private accessTtl(): JwtSignOptions['expiresIn'] {
    return (process.env.JWT_ACCESS_TTL ?? '15m') as JwtSignOptions['expiresIn'];
  }

  private refreshTtl(): JwtSignOptions['expiresIn'] {
    return (process.env.JWT_REFRESH_TTL ?? '7d') as JwtSignOptions['expiresIn'];
  }

  private async signTokens(userId: string, role: GlobalRole): Promise<JwtPair> {
    const accessToken = await this.jwt.signAsync(
      { sub: userId, role },
      { secret: this.accessSecret(), expiresIn: this.accessTtl() },
    );

    const refreshToken = await this.jwt.signAsync(
      { sub: userId, role, typ: 'refresh' },
      { secret: this.refreshSecret(), expiresIn: this.refreshTtl() },
    );

    return { accessToken, refreshToken };
  }

  async register(input: {
    email: string;
    password: string;
    fullName: string;
    role?: GlobalRole;
  }) {
    const exists = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (exists) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const role = input.role ?? GlobalRole.STUDENT;

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          profile: {
            create: {
              fullName: input.fullName,
              role,
            },
          },
          wallet: {
            create: {
              coinsBalance: 0,
              diamondsBalance: 0,
            },
          },
        },
        include: { profile: true },
      });

      return created;
    });

    const tokens = await this.signTokens(user.id, user.profile!.role);
    return { userId: user.id, role: user.profile!.role, ...tokens };
  }

  async login(input: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
      include: { profile: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.signTokens(user.id, user.profile!.role);
    return { userId: user.id, role: user.profile!.role, ...tokens };
  }

  async refresh(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.signTokens(user.id, user.profile!.role);
  }
}
