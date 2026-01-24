import { IsEnum } from 'class-validator';
import { JobRole } from '@prisma/client';

export class SetPracticaRolesDto {
  @IsEnum(JobRole)
  role1: JobRole;

  @IsEnum(JobRole)
  role2: JobRole;
}
