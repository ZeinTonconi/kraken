import { IsOptional, IsString, IsUrl, Matches } from 'class-validator';

export class UpdateProfile {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9_]*$/, {
    message:
      'handle must contain only lowercase letters, numbers, and underscore',
  })
  handle?: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, {message: "avatarUrl must be a valid URL"})
  avatarUrl?: string;
}
