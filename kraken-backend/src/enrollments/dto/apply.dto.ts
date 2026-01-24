import { IsEnum, IsInt, IsOptional, IsUUID } from 'class-validator';
import { EnrollmentTrack } from '@prisma/client';

export class ApplyDto {
  @IsUUID()
  userId: string;

  @IsEnum(EnrollmentTrack)
  track: EnrollmentTrack;

  @IsInt()
  academicYear: number;

  //TODO:  Solo si track = PRACTICA_INTERNA (por ahora no pedimos roles aún)
  @IsOptional()
  @IsUUID()
  rotationProgramId?: string;
}
