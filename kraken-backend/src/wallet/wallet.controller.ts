import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { GlobalRole } from '@prisma/client';
import { AwardDto } from './dto/award.dto';
import { WalletService } from './wallet.service';

@Controller()
export class WalletController {
  constructor(private readonly wallet: WalletService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalRole.ADMIN, GlobalRole.TEACHER)
  @Post('students/:id/award')
  award(
    @Param('id') studentId: string,
    @Body() dto: AwardDto,
    @Req() req: any,
  ) {
    const createdBy = req.user.sub;
    return this.wallet.awardStudent({ studentId, createdBy, dto });
  }
}
