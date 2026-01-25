import {
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class GenerateTeamsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  minJuniorsPerTeam?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxJuniorsPerTeam?: number;

  @IsOptional()
  @IsBoolean()
  force?: boolean;

  @IsOptional()
  @IsObject()
  leaderTargets?: Record<string, number>;

  @IsOptional()
  @IsObject()
  juniorTargetsPct?: Record<string, number>;
}
