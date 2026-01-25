import { Module } from '@nestjs/common';
import { RotationProgramService } from './rotation-program.service';
import { RotationProgramController } from './rotation-program.controller';
import { RotationProgramsController } from './rotation-programs.controller';

@Module({
  providers: [RotationProgramService],
  controllers: [RotationProgramController, RotationProgramsController]
})
export class RotationProgramModule {}
