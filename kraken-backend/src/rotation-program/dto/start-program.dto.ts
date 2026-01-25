import { IsDateString, IsOptional } from 'class-validator';

export class StartProgramDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;
}
