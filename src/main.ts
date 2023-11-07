import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

// class Application {
//   private logger = new Logger(Application.name)
//   private DEV_MODE: boolean
//   private PORT: string
//   private corsOriginList: string[]
//   private ADMIN_USER: string
//   private ADMIN_PASSWORD: string

//   constructor(private server: NestExpressApplication) {
//     this.server = server
//   }
// }