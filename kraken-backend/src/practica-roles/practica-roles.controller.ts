import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PracticaRolesService } from './practica-roles.service';
import { SetPracticaRolesDto } from './dto/set-practica-roles.dto';

@Controller()
export class PracticaRolesController {
  constructor(private readonly practicaRoles: PracticaRolesService) {}

  @Get('enrollments/:id/practica/role-options')
  getOptions(@Param('id') enrollmentId: string) {
    return this.practicaRoles.getRoleOptions(enrollmentId);
  }

  @Post('enrollments/:id/practica/roles')
  setRoles(
    @Param('id') enrollmentId: string,
    @Body() dto: SetPracticaRolesDto,
  ) {
    return this.practicaRoles.setRoles(enrollmentId, dto.role1, dto.role2);
  }
}
