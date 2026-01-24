import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollmentStatus, EnrollmentTrack, JobRole } from '@prisma/client';

type Counts = Record<JobRole, number>;
type Targets = Record<JobRole, number>;

@Injectable()
export class PracticaRolesService {
  constructor(private prisma: PrismaService) {}

  private roles: JobRole[] = [
    JobRole.QA,
    JobRole.FRONTEND,
    JobRole.BACKEND,
    JobRole.DEVOPS,
  ];

  // targets 30/30/30/10 por cantidad total N
  private computeTargets(total: number): Targets {
    const qa = Math.round(total * 0.3);
    const fe = Math.round(total * 0.3);
    const be = Math.round(total * 0.3);
    const dev = total - (qa + fe + be); // asegura suma exacta

    return {
      [JobRole.QA]: qa,
      [JobRole.FRONTEND]: fe,
      [JobRole.BACKEND]: be,
      [JobRole.DEVOPS]: dev,
    };
  }

  private async countAssignedPrimaryRoles(offeringId: string): Promise<Counts> {
    const grouped = await this.prisma.enrollment.groupBy({
      by: ['primaryRole'],
      where: {
        offeringId,
        track: EnrollmentTrack.PRACTICA_INTERNA,
        status: EnrollmentStatus.APPROVED,
      },
      _count: { _all: true },
    });

    const counts: Counts = {
      [JobRole.QA]: 0,
      [JobRole.FRONTEND]: 0,
      [JobRole.BACKEND]: 0,
      [JobRole.DEVOPS]: 0,
    };

    for (const g of grouped) {
      if (g.primaryRole) counts[g.primaryRole] = g._count._all;
    }

    return counts;
  }

  private pickOptions(targets: Targets, counts: Counts) {
    const scored = this.roles.map((role) => ({
      role,
      deficit: (targets[role] ?? 0) - (counts[role] ?? 0),
    }));

    // mayor deficit = más faltante = más prioridad
    scored.sort((a, b) => b.deficit - a.deficit);

    const mandatoryRole = scored[0].role;
    const selectableRoles = [scored[1].role, scored[2].role];
    const allShownRoles = [mandatoryRole, ...selectableRoles];

    return { mandatoryRole, selectableRoles, allShownRoles, scored };
  }

  async getRoleOptions(enrollmentId: string) {
    const enr = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      select: {
        id: true,
        offeringId: true,
        track: true,
        status: true,
        prefRole1: true,
        prefRole2: true,
        prefRole3: true,
        primaryRole: true,
      },
    });

    if (!enr) throw new NotFoundException('Enrollment not found');
    if (enr.track !== EnrollmentTrack.PRACTICA_INTERNA)
      throw new BadRequestException('Enrollment is not PRACTICA_INTERNA');
    if (enr.status !== EnrollmentStatus.APPROVED)
      throw new BadRequestException('Enrollment is not APPROVED');

    const totalApproved = await this.prisma.enrollment.count({
      where: {
        offeringId: enr.offeringId,
        track: EnrollmentTrack.PRACTICA_INTERNA,
        status: EnrollmentStatus.APPROVED,
      },
    });

    const targets = this.computeTargets(totalApproved);
    const counts = await this.countAssignedPrimaryRoles(enr.offeringId);

    const { mandatoryRole, selectableRoles, allShownRoles, scored } =
      this.pickOptions(targets, counts);

    return {
      enrollmentId: enr.id,
      mandatoryRole,
      selectableRoles,
      allShownRoles,
      targets,
      counts,
      deficits: scored,
      alreadyChosen: {
        primaryRole: enr.primaryRole,
        prefRole1: enr.prefRole1,
        prefRole2: enr.prefRole2,
        prefRole3: enr.prefRole3,
      },
    };
  }

  async setRoles(enrollmentId: string, role1: JobRole, role2: JobRole) {
    if (role1 === role2)
      throw new BadRequestException('role1 and role2 must be different');

    // recalcular options en el momento del POST (evita race conditions)
    const options = await this.getRoleOptions(enrollmentId);

    const allowed = new Set(options.selectableRoles);
    if (!allowed.has(role1) || !allowed.has(role2)) {
      throw new BadRequestException(
        `You must select 2 roles from: ${options.selectableRoles.join(', ')} (mandatory is ${options.mandatoryRole})`,
      );
    }

    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        prefRole1: role1,
        prefRole2: role2,
        prefRole3: options.mandatoryRole,
        primaryRole: options.mandatoryRole, // simple por ahora
      },
    });
  }
}
