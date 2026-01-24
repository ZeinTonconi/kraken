import { Module } from '@nestjs/common';
import { PracticaRolesService } from './practica-roles.service';
import { PracticaRolesController } from './practica-roles.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PracticaRolesController],
  providers: [PracticaRolesService],
})
export class PracticaRolesModule {}
