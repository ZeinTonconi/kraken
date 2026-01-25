import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTerm } from './dto/create-term.dto';
import { UpdateTerm } from './dto/update-term.dto';
import { Prisma } from '@prisma/client';

const checkTermDates = (startsAt?: Date | null, endsAt?: Date | null) => {
  if (endsAt && !startsAt)
    throw new BadRequestException('Start date was not specified');

  if (startsAt && endsAt && endsAt < startsAt)
    throw new BadRequestException('Start date is greater than the end date');
  return;
};

@Injectable()
export class TermsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTerms(term: CreateTerm) {
    checkTermDates(term.startsAt, term.endsAt);

    const exists = await this.prisma.term.findUnique({
      where: { name: term.name },
    });
    if (exists) throw new BadRequestException('Term name already in use');

    return await this.prisma.term.create({
      data: { ...term },
    });
  }

  async updateTerm(termId: string, term: UpdateTerm) {
    const current = await this.prisma.term.findUnique({
      where: { id: termId },
      select: { startsAt: true, endsAt: true },
    });
    if (!current) throw new NotFoundException('Term not found');

    const finalStartsAt =
      term.startsAt !== undefined ? term.startsAt : current.startsAt;
    const finalEndsAt =
      term.endsAt !== undefined ? term.endsAt : current.endsAt;

    checkTermDates(finalStartsAt, finalEndsAt);

    try {
      return await this.prisma.term.update({
        where: { id: termId },
        data: {
          ...(term.year !== undefined ? { year: term.year } : {}),
          ...(term.name !== undefined ? { name: term.name } : {}),
          ...(term.period !== undefined ? { period: term.period } : {}),
          startsAt: finalStartsAt,
          endsAt: finalEndsAt,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('Term name already in use');
        if (e.code === 'P2025') throw new NotFoundException('Term not found');
      }
      throw e;
    }
  }
}
