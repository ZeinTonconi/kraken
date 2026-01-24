import { IsInt, IsUUID } from 'class-validator';

export class CreateOfferingDto {
  @IsUUID()
  courseId: string;

  @IsUUID()
  termId: string;

  @IsUUID()
  teacherId: string;

  //   @IsInt()
  //   academicYear: number;
}
