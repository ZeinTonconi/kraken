import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { WalletTxnType } from '@prisma/client';

export class AwardDto {
  @IsEnum(WalletTxnType)
  type!: WalletTxnType;

  @IsInt()
  amount!: number; // can be negative, rules enforced in service

  @IsString()
  @MaxLength(250)
  reason!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  refType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  refId?: string;
}
