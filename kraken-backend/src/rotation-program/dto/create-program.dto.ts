import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsString, ValidateIf } from 'class-validator';

export class CreateProgramDto {
  @IsInt()
  @Type(() => Number)
  academicYear: number;

  @IsString()
  name: string;

  @ValidateIf((o) => !o.startsAt)
  @IsDateString()
  startDate: string;

  @ValidateIf((o) => !o.startDate)
  @IsDateString()
  startsAt: string;

  @ValidateIf((o) => !o.endsAt)
  @IsDateString()
  endDate: string;

  @ValidateIf((o) => !o.endDate)
  @IsDateString()
  endsAt: string;
}
