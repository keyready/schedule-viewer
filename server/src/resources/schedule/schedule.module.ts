import { Module } from '@nestjs/common';
import { ParserService } from '../../shared/parser/parser.service';
import { ScheduleController } from './schedule.controller';

@Module({
  controllers: [ScheduleController],
  providers: [ParserService],
})
export class ScheduleModule {}


