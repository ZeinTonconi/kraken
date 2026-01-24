import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MeService {
  constructor(private prisma: PrismaService) {}

  async myOfferings(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { studentId: userId, status: 'APPROVED' },
      include: {
        offering: {
          include: {
            course: true,
            term: true,
            teacher: { include: { profile: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
