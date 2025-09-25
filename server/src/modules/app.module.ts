import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AudsModule } from '../resources/auds/auds.module';
import { KafsModule } from '../resources/kafs/kafs.module';
import { ScheduleModule } from '../resources/schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/schedule-viewer',
      }),
    }),
    AudsModule,
    KafsModule,
    ScheduleModule,
  ],
})
export class AppModule {}


