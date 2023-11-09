import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { UrlModule } from './api/url/url.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from './entities/url.entity';

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
      synchronize: true,
    }),
    UrlModule,
  ],
  controllers: [AppController],
  providers: [],
})

export class AppModule { }


// Module위로 가야함
// let envPath: string;
// switch (process.env.APP_ENV) {
//   case 'dev': envPath = 'envs/.local.env'; break;
//   case 'staging': envPath = 'envs/.staging.env'; break;
//   case 'prod': envPath = 'envs/.prod.env'; break;
//   default: envPath = 'envs/.local.env'
// }
// dotenv.config({ path: path.resolve(envPath) })