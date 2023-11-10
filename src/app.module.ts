import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { UrlModule } from './api/url/url.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from './entities/url.entity';
import { AsyncWrapMiddleware } from 'middleware/aync-wrap.middleware';
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
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'shortenURL',
      entities: [
          UrlEntity,
      ],
      synchronize: false,
    }),
    UrlModule,
  ],
  controllers: [AppController],
  providers: [],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AsyncWrapMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); 
  }
}

