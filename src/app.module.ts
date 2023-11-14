import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core'
import { HttpApiExceptionFilter } from './common/exceptions/http-api-exception.filter';
import { AppController } from './app.controller';
import { UrlModule } from './api/url/url.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UrlRepository } from './repo/url.repository';
import { UrlEntity } from './entities/url.entity';
import * as dotenv from 'dotenv'
import * as path from 'path'

let envPath: string;
switch (process.env.APP_ENV) {
  case 'dev': envPath = 'envs/.local.env'; break;
  case 'staging': envPath = 'envs/.staging.env'; break;
  case 'prod': envPath = 'envs/.prod.env'; break;
  default: envPath = 'envs/.local.env'
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
      entities: [
          UrlEntity,
      ],
      synchronize: false,
    }),
    UrlModule,
  ],
  controllers: [AppController],
  providers: [
    {
    provide: APP_FILTER,
    useClass: HttpApiExceptionFilter,
  },
  AppService,
  UrlRepository
  ]
})

export class AppModule { }

