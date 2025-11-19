import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AudsModule } from '../auds/auds.module';
import { Kaf, KafSchema } from './schemas/kaf.schema';
import { KafsService } from './kafs.service';
import { KafsController } from './kafs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Kaf.name, schema: KafSchema }]),
    forwardRef(() => AudsModule),
  ],
  providers: [KafsService],
  controllers: [KafsController],
  exports: [KafsService],
})
export class KafsModule {}


