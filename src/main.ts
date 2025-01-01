import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');

  app.enableCors({
    origin: '*',
  });

  await app.listen(process.env.API_PORT || 3000, '0.0.0.0');
}
bootstrap();
