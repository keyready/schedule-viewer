import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Aud, AudSchema } from './schemas/aud.schema';
import { AudsService } from './auds.service';
import { AudsController } from './auds.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Aud.name, schema: AudSchema }])],
  providers: [AudsService],
  controllers: [AudsController],
  exports: [AudsService],
})
export class AudsModule {}


