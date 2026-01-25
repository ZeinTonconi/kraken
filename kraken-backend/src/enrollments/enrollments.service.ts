import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollmentStatus, GlobalRole } from '@prisma/client';
import { ApplyDto } from './dto/apply.dto';
import { timeStamp } from 'console';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async apply(offeringId: string, dto: ApplyDto) {
    const offering = await this.prisma.courseOffering.findUnique({
      where: { id: offeringId },
    });
    if (!offering) throw new BadRequestException('Offering not found');

    const existing = await this.prisma.enrollment.findFirst({
      where: { offeringId, studentId: dto.userId },
    });
    if (existing) {
      throw new BadRequestException(
        'You already applied/enrolled to this offering',
      );
    }

    return this.prisma.enrollment.create({
      data: {
        offeringId,
        studentId: dto.userId,
        track: dto.track,
        academicYear: dto.academicYear,
        status: EnrollmentStatus.APPLIED,
      },
    });
  }

  async approve(enrollmentId: string) {
    const enr = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });
    if (!enr) throw new BadRequestException('Enrollment not found');
    if (enr.status !== 'APPLIED')
      throw new BadRequestException('Only APPLIED can be approved');

    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: 'APPROVED' },
    });
  }

  async reject(enrollmentId: string) {
    const enr = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });
    if (!enr) throw new BadRequestException('Enrollment not found');
    if (enr.status !== 'APPLIED')
      throw new BadRequestException('Only APPLIED can be rejected');

    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: 'REJECTED' },
    });
  }

  async listApplications(offeringId: string, status?: string) {
    return this.prisma.enrollment.findMany({
      where: {
        offeringId,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        student: { include: { profile: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async listEnrolled(
    offeringId: string,
    requesterId: string,
    requesterRole: GlobalRole,
  ) {
    const offering = await this.prisma.courseOffering.findUnique({
      where: { id: offeringId },
      select: { id: true, teacherId: true },
    });
    if (!offering) throw new NotFoundException('Offering not found');

    if (
      requesterRole === GlobalRole.TEACHER &&
      offering.teacherId !== requesterId
    ) {
      throw new ForbiddenException('Not allowed');
    }

    return this.prisma.enrollment.findMany({
      where: { offeringId, status: EnrollmentStatus.APPROVED },
      select: {
        student: {
          select: {
            id: true,
            email: true,
            profile: {
              select: { fullName: true, handle: true, avatarUrl: true },
            },
          },
        },
      },
    });
  }
}
