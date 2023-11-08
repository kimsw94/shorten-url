import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common'
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'body-parser'

// class Application {
//   private logger = new Logger(Application.name)
//   private DEV_MODE: boolean
//   private PORT: string

//   constructor(private server: NestExpressApplication) {
//     this.server = server
//     this.DEV_MODE = process.env.NODE_ENV === 'production' ? false : true
//     this.PORT = process.env.PORT || '3100'
//   }

//   async bootstrap() {
//     await this.server.listen(this.PORT)
//     console.log("server on")
//   }

//   startLog() {
//     if(this.DEV_MODE) {
//       this.logger.log('Server on http://localshost:${ this.PORT }')
//     } else {
//       this.logger.log('Server on port ${ this.PORT }')  
//     }
//   }
// }

// async function init(): Promise<void> {
//   const server = await NestFactory.create<NestExpressApplication>(AppModule)
//   server.use(json({ limit : '50mb' }))
//   server.use(urlencoded({ extended: true, limit: '50mb' }))
//   const app = new Application(server)
//   await app.bootstrap()
//   app.startLog()
// }

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
