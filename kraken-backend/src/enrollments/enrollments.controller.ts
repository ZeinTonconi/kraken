import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { ApplyDto } from './dto/apply.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { GlobalRole } from '@prisma/client';
import { Roles } from 'src/common/roles.decorator';
import { JwtPayload } from 'src/auth/jwt.strategy';

@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollments: EnrollmentsService) {}

  // aplicar a un offering
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalRole.STUDENT)
  @Post('offerings/:offeringId/apply')
  apply(@Param('offeringId') offeringId: string, @Body() dto: ApplyDto) {
    return this.enrollments.apply(offeringId, dto);
  }

  // admin: ver postulaciones
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalRole.ADMIN, GlobalRole.TEACHER)
  @Get('offerings/:offeringId/applications')
  listApplications(
    @Param('offeringId') offeringId: string,
    @Query('status') status?: string,
  ) {
    return this.enrollments.listApplications(offeringId, status);
  }

  // admin: aprobar
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalRole.ADMIN, GlobalRole.TEACHER)
  @Post('enrollments/:enrollmentId/approve')
  approve(@Param('enrollmentId') enrollmentId: string) {
    return this.enrollments.approve(enrollmentId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalRole.ADMIN, GlobalRole.TEACHER)
  @Post('enrollments/:enrollmentId/deny')
  deny(@Param('enrollmentId') enrollmentId: string) {
    return this.enrollments.reject(enrollmentId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalRole.TEACHER, GlobalRole.ADMIN)
  @Get('offerings/:offeringId/enrolled')
  listEnrolled(
    @Request() req: { user: JwtPayload },
    @Param('offeringId') offeringId: string,
  ) {
    return this.enrollments.listEnrolled(
      offeringId,
      req.user.sub,
      req.user.role,
    );
  }
}
