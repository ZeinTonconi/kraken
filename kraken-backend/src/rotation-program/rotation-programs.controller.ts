import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RotationProgramService } from './rotation-program.service';
import { StartProgramDto } from './dto/start-program.dto';
import { GenerateTeamsDto } from './dto/generate-teams.dto';
import { GenerateJuniorRotationDto } from './dto/generate-junior-rotation.dto';
import { PreviewJuniorRotationDTO } from './dto/preview-junior-rotation.dto';

@Controller('rotation-programs')
export class RotationProgramsController {
  constructor(private readonly rotationPrograms: RotationProgramService) {}

  @Post(':id/start')
  start(@Param('id') id: string, @Body() dto: StartProgramDto) {
    return this.rotationPrograms.startProgram(id, dto);
  }

  @Post(':programId/blocks/:blockId/generate-teams')
  generateTeams(
    @Param('programId') programId: string,
    @Param('blockId') blockId: string,
    @Body() dto: GenerateTeamsDto,
  ) {
    return this.rotationPrograms.generateTeams(programId, blockId, dto);
  }

  @Get(':id')
  getProgram(@Param('id') id: string) {
    return this.rotationPrograms.getProgram(id);
  }
  
  @Get(':programId/juniors/rotation-preview')
  previewJuniorRotation(
    @Param('programId') programId: string
  ) {
    return this.rotationPrograms.previewJuniorRotation(programId);
  }

}
