import { IsOptional, IsString } from 'class-validator';

export class UpdateProfile {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  handle?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
