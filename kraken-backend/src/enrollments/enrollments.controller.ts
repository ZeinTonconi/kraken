import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { ApplyDto } from './dto/apply.dto';

@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollments: EnrollmentsService) {}

  // aplicar a un offering
  @Post('offerings/:offeringId/apply')
  apply(@Param('offeringId') offeringId: string, @Body() dto: ApplyDto) {
    return this.enrollments.apply(offeringId, dto);
  }

  // admin: ver postulaciones
  @Get('offerings/:offeringId/applications')
  listApplications(
    @Param('offeringId') offeringId: string,
    @Query('status') status?: string,
  ) {
    return this.enrollments.listApplications(offeringId, status);
  }

  // admin: aprobar
  @Post('enrollments/:enrollmentId/approve')
  approve(@Param('enrollmentId') enrollmentId: string) {
    return this.enrollments.approve(enrollmentId);
  }
}
