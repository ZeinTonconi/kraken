import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferingDto } from './dto/create-offering.dto';

@Injectable()
export class OfferingsService {
  constructor(private prisma: PrismaService) {}

  async getAvailable() {
    return this.prisma.courseOffering.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        course: true,
        term: true,
        teacher: { include: { profile: true } },
      },
    });
  }

  async create(dto: CreateOfferingDto) {
    const [course, term, teacher] = await Promise.all([
      this.prisma.course.findUnique({ where: { id: dto.courseId } }),
      this.prisma.term.findUnique({ where: { id: dto.termId } }),
      this.prisma.user.findUnique({ where: { id: dto.teacherId } }),
    ]);

    if (!course) throw new BadRequestException('Course not found');
    if (!term) throw new BadRequestException('Term not found');
    if (!teacher) throw new BadRequestException('Teacher not found');

    return this.prisma.courseOffering.create({
      data: {
        courseId: dto.courseId,
        termId: dto.termId,
        teacherId: dto.teacherId,
      },
      include: {
        course: true,
        term: true,
        teacher: { include: { profile: true } },
      },
    });
  }
}
