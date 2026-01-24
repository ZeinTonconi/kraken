import { Body, Controller, Get, Post } from '@nestjs/common';
import { OfferingsService } from './offerings.service';
import { CreateOfferingDto } from './dto/create-offering.dto';

@Controller('offerings')
export class OfferingsController {
  constructor(private readonly offerings: OfferingsService) {}

  @Get('available')
  getAvailable() {
    return this.offerings.getAvailable();
  }

  @Post()
  create(@Body() dto: CreateOfferingDto) {
    return this.offerings.create(dto);
  }
}
