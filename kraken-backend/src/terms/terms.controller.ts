import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TermsService } from './terms.service';
import { CreateTerm } from './dto/create-term.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { GlobalRole } from '@prisma/client';
import { UpdateTerm } from './dto/update-term.dto';

@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalRole.ADMIN)
  @Post('')
  createTerm(@Body() term: CreateTerm) {
    return this.termsService.createTerms(term);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalRole.ADMIN)
  @Put(':id')
  updateTerm(@Param('id') termId: string, @Body() term: UpdateTerm) {
    return this.termsService.updateTerm(termId, term);
  }
}
