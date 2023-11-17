import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpApiExceptionFilter } from './common/exceptions/http-api-exception.filter';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UrlGenerate } from './common/utils/url-generate';
import { UrlValidate } from './common/utils/url-validate';
import { AppRepository } from './repo/app.repository';
import { UrlEntity } from './entities/url.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { IpCount } from './common/utils/ip-count';
import { IpClean } from './common/utils/ip-clean';

let envPath: string;
switch (process.env.APP_ENV) {
  case 'dev':
    envPath = 'envs/.local.env';
    break;
  case 'staging':
    envPath = 'envs/.staging.env';
    break;
  case 'prod':
    envPath = 'envs/.prod.env';
    break;
  default:
    envPath = 'envs/.local.env';
}

dotenv.config({ path: path.resolve(envPath) });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UrlEntity],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpApiExceptionFilter,
    },
    AppService,
    AppRepository,
    UrlGenerate,
    UrlValidate,
    IpCount,
    IpClean
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(IpLogger, IpServer)
  //     .forRoutes({ path: '*', method: RequestMethod.ALL });
  // }
}
