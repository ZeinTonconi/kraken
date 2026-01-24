import { Module } from '@nestjs/common';
import { RotationProgramService } from './rotation-program.service';
import { RotationProgramController } from './rotation-program.controller';

@Module({
  providers: [RotationProgramService],
  controllers: [RotationProgramController]
})
export class RotationProgramModule {}
