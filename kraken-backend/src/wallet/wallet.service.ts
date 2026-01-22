import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AwardDto } from './dto/award.dto';
import { WalletTxnType } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async awardStudent(params: {
    studentId: string;
    createdBy: string;
    dto: AwardDto;
  }) {
    const { studentId, createdBy, dto } = params;

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: studentId },
      select: { userId: true, coinsBalance: true, diamondsBalance: true },
    });

    if (!wallet) {
      throw new NotFoundException('Student wallet not found');
    }

    const currentCoins = wallet.coinsBalance;
    const currentDiamonds = wallet.diamondsBalance;

    let nextCoins = currentCoins;
    let nextDiamonds = currentDiamonds;

    if (dto.type === WalletTxnType.COINS) {
      nextCoins = currentCoins + dto.amount;
      if (nextCoins < 0) {
        throw new BadRequestException(
          `Invalid operation: coins cannot go below 0 (current=${currentCoins}, amount=${dto.amount})`,
        );
      }
    } else {
      nextDiamonds = currentDiamonds + dto.amount;
      if (nextDiamonds < 0) {
        throw new BadRequestException(
          `Invalid operation: diamonds cannot go below 0 (current=${currentDiamonds}, amount=${dto.amount})`,
        );
      }
      if (nextDiamonds > 100) {
        throw new BadRequestException(
          `Invalid operation: diamonds cannot exceed 100 (current=${currentDiamonds}, amount=${dto.amount})`,
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const txn = await tx.walletTransaction.create({
        data: {
          userId: studentId,
          walletUserId: studentId,
          type: dto.type,
          amount: dto.amount,
          reason: dto.reason,
          refType: dto.refType,
          refId: dto.refId,
          createdBy,
        },
      });

      const updatedWallet = await tx.wallet.update({
        where: { userId: studentId },
        data:
          dto.type === WalletTxnType.COINS
            ? { coinsBalance: nextCoins }
            : { diamondsBalance: nextDiamonds },
        select: {
          userId: true,
          coinsBalance: true,
          diamondsBalance: true,
          updatedAt: true,
        },
      });

      return { transaction: txn, wallet: updatedWallet };
    });
  }
}
