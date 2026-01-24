import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobRole, ProgramBlockType } from '@prisma/client/edge';

@Injectable()
export class RotationProgramService {
  constructor(private prisma: PrismaService) {}

  createProgram(createProgramDto: CreateProgramDto) {
    const startsAt = createProgramDto.startDate ?? createProgramDto.startsAt;
    const endsAt = createProgramDto.endDate ?? createProgramDto.endsAt;

    return this.prisma.rotationProgram.create({
      data: {
        academicYear: createProgramDto.academicYear,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        name: createProgramDto.name,
      },
    });
  }

  async initBlocks(programId: string) {
    const program = await this.prisma.rotationProgram.findUnique({
      where: { id: programId },
      include: { blocks: true },
    });

    if (!program) throw new NotFoundException('RotationProgram not found');

    if (program.blocks.length > 0) {
      throw new BadRequestException(
        'Blocks already initialized for this program',
      );
    }

    const programStart = new Date(program.startsAt);

    // Helpers
    const addMonths = (d: Date, months: number) => {
      const x = new Date(d);
      x.setMonth(x.getMonth() + months);
      return x;
    };

    let cursor = programStart;
    let order = 1;

    const blocksData: {
      programId: string;
      type: ProgramBlockType;
      order: number;
      startsAt: Date;
      endsAt: Date;
      role?: JobRole | null;
    }[] = [];

    // 3 LEADER_BLOCK x 3 meses = 9 meses
    for (let i = 0; i < 3; i++) {
      const startsAt = cursor;
      const endsAt = addMonths(startsAt, 3);
      blocksData.push({
        programId,
        type: ProgramBlockType.LEADER_BLOCK,
        order: order++,
        startsAt,
        endsAt,
        role: null,
      });
      cursor = endsAt;
    }

    // 4 JUNIOR_ROLE_BLOCK x 2 meses = 8 meses
    // Nota: estos bloques no necesariamente calzan perfecto con los de líder,
    // pero sirven para asignar roles juniors por calendario.
    // Arrancan desde el inicio del programa (recomendado), no desde cursor.
    // Si quieres que arranquen también desde programStart, usamos otro cursor:
    let juniorCursor = programStart;
    const juniorRoles: JobRole[] = [
      JobRole.QA,
      JobRole.FRONTEND,
      JobRole.BACKEND,
      JobRole.DEVOPS,
    ];

    for (const role of juniorRoles) {
      const startsAt = juniorCursor;
      const endsAt = addMonths(startsAt, 2);
      blocksData.push({
        programId,
        type: ProgramBlockType.JUNIOR_ROLE_BLOCK,
        order: order++,
        startsAt,
        endsAt,
        role,
      });
      juniorCursor = endsAt;
    }

    // Inserta todo
    const created = await this.prisma.programBlock.createMany({
      data: blocksData.map((b) => ({
        programId: b.programId,
        type: b.type,
        order: b.order,
        startsAt: b.startsAt,
        endsAt: b.endsAt,
        role: b.role ?? null,
      })),
    });

    return {
      message: 'Blocks initialized',
      count: created.count,
    };
  }

  async listBlocks(programId: string) {
    return this.prisma.programBlock.findMany({
      where: { programId },
      orderBy: [{ startsAt: 'asc' }, { type: 'asc' }, { order: 'asc' }],
    });
  }
}
