import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpApiExceptionFilter } from './common/exceptions/http-api-exception.filter';
import { json, urlencoded } from 'body-parser';
import * as cookieParser from 'cookie-parser';

class Application {
  private logger = new Logger(Application.name);
  private DEV_MODE: boolean;
  private corsOriginList: string[]
  private PORT: string;

  constructor(
    private server: NestExpressApplication
    ) {
    this.server = server;
    this.DEV_MODE = process.env.NODE_ENV === 'production' ? false : true;
  
    if (this.DEV_MODE) {
      this.corsOriginList = [
        'http://192.168.1.137:3000','http://localhost:3000', 'http://192.168.1.12:3000', 'http://192.168.1.12'
      ,'http://192.168.1.137:3001','http://localhost:3001', 'http://192.168.1.12:3001'
    ];
    } else {
      this.corsOriginList = [
      ];
    }
    this.PORT = process.env.PORT || '3100';
  }
 
  private async setUpGlobalMiddleware() {

    this.server.enableCors({
      origin: this.corsOriginList,
      credentials: true,
      exposedHeaders: 'Content-Disposition',
    });
    this.server.use(cookieParser())
    
    this.server.useGlobalFilters(new HttpApiExceptionFilter());
  }

  async bootstrap() {
    await this.setUpGlobalMiddleware();
    await this.server.use(cookieParser())
    await this.server.listen(this.PORT);
  }

  startLog() {
    if (this.DEV_MODE) {
      this.logger.log(`Server on http://localhost:${this.PORT}`);
    } else {
      this.logger.log(`Server on port ${this.PORT}`);
    }
  }
}

async function init(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);
  server.use(json({ limit: '50mb' }));
  server.use(urlencoded({ extended: true, limit: '50mb' }));
  const app = new Application(server);
  await app.bootstrap();
  app.startLog();
}

init().catch((error) => {
  new Logger('init').error(error);
});
