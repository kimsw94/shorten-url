import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common'
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpApiExceptionFilter } from './common/exceptions/http-api-exception.filter';
import { json, urlencoded } from 'body-parser'

class Application {
  private logger = new Logger(Application.name)
  private corsOriginList: string[]
  private DEV_MODE: boolean
  private PORT: string

  constructor(private server: NestExpressApplication) {
    this.server = server
    this.DEV_MODE = process.env.NODE_ENV === 'production' ? false : true
    if (this.DEV_MODE) {
      this.corsOriginList = [
        'http://localhost:3100',
        'http://127.0.0.1:3100', 
        'http://192.168.1.132:3100/'
      ]
    } else {
      this.corsOriginList = [
      ]
    }
    this.PORT = process.env.PORT || '3100'
  }

  private async setUpGlobalMiddleware() {
    this.server.useGlobalFilters(new HttpApiExceptionFilter())
  }

  async bootstrap() {
    await this.setUpGlobalMiddleware()
    await this.server.listen(this.PORT)
  }

  startLog() {
    if(this.DEV_MODE) {
      this.logger.log(`Server on http://localhost:${this.PORT}`);
    } else {
      this.logger.log('Server on port ${ this.PORT }')  
    }
  }
}

async function init(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule)
  server.use(json({ limit : '50mb' }))
  server.use(urlencoded({ extended: true, limit: '50mb' }))
  const app = new Application(server)
  await app.bootstrap()
  app.startLog()
}

init().catch((error) => {
  new Logger('init').error(error)
})


// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();
