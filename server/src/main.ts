import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = Number(process.env.PORT || 6000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Server started on http://localhost:${port}`);
}

bootstrap();


