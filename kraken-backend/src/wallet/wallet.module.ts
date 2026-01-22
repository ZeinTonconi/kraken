import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { RolesGuard } from '../common/roles.guard';
import { WalletService } from './wallet.service';

@Module({
  controllers: [WalletController],
  providers: [WalletService, RolesGuard],
})
export class WalletModule {}
