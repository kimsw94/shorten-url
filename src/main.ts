import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

//추가가 필요함

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
