import { Controller, Get, Query } from '@nestjs/common';
import { MeService } from './me.service';

@Controller('me')
export class MeController {
  constructor(private readonly me: MeService) {}

  @Get('offerings')
  myOfferings(@Query('userId') userId: string) {
    return this.me.myOfferings(userId);
  }
}
