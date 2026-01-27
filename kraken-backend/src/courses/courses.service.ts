import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourses } from './dto/create-courses.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCourses } from './dto/update-courses.dto';
import { GlobalRole, Prisma } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCourses(course: CreateCourses) {
    const exists = await this.prisma.course.findUnique({
      where: { code: course.code },
    });
    if (exists) throw new BadRequestException('Code course already in use');

    return await this.prisma.course.create({
      data: { ...course },
    });
  }

  async updateCourse(courseId: string, course: UpdateCourses) {
    try {
      return await this.prisma.course.update({
        where: { id: courseId },
        data: {
          ...(course.code !== undefined ? { code: course.code } : {}),
          ...(course.name !== undefined ? { name: course.name } : {}),
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new NotFoundException('Course not found');
        if (e.code === 'P2002')
          throw new BadRequestException('Code course already in use');
      }
      throw e;
    }
  }

  async getMyCourses(teacherId: string, termId?: string) {
    const where: any = { teacherId };

    if (termId) {
      const term = await this.prisma.term.findUnique({
        where: { id: termId }
      });

      if (!term) throw new NotFoundException('Term not found');

      where.termId = term.id;
    }

    return this.prisma.courseOffering.findMany({
      where,
      select: {
        id: true,
        course: {
          select: {
            code: true,
            name: true,
          },
        },
        term: {
          select: {
            name: true,
            year: true,
            period: true,
            startsAt: true,
            endsAt: true,
          },
        },
      },
      orderBy: { term: { startsAt: 'desc' } },
    });
  }
}
