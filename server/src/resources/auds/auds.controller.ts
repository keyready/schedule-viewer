import { Controller, Get } from '@nestjs/common';
import { AudsService } from './auds.service';

@Controller('api')
export class AudsController {
  constructor(private readonly audsService: AudsService) {}

  @Get('fetch_auds')
  fetchAuds() {
    return this.audsService.findAll();
  }
}


