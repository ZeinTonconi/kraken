import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RotationProgramService } from './rotation-program.service';
import { CreateProgramDto } from './dto/create-program.dto';

@Controller('rotation-program')
export class RotationProgramController {
  constructor(private rotationProgramService: RotationProgramService) {}

  @Post()
  create(@Body() dto: CreateProgramDto) {
    return this.rotationProgramService.createProgram(dto);
  }

  @Post(':id/blocks/init')
  initBlocks(@Param('id') id: string) {
    return this.rotationProgramService.initBlocks(id);
  }

  @Get(':id/blocks')
  listBlocks(@Param('id') id: string) {
    return this.rotationProgramService.listBlocks(id);
  }
}
